package com.tyreplus.dealer.application.service;

import com.tyreplus.dealer.application.dto.VerifyOtpRequest;
import com.tyreplus.dealer.application.dto.LoginRequest;
import com.tyreplus.dealer.application.dto.LoginResponse;
import com.tyreplus.dealer.application.dto.RegisterRequest;
import com.tyreplus.dealer.application.exception.UserNotFoundException;
import com.tyreplus.dealer.domain.entity.Dealer;
import com.tyreplus.dealer.domain.entity.Wallet;
import com.tyreplus.dealer.domain.repository.DealerRepository;
import com.tyreplus.dealer.domain.repository.CustomerRepository;
import com.tyreplus.dealer.domain.repository.WalletRepository;
import com.tyreplus.dealer.domain.entity.Customer;
import com.tyreplus.dealer.domain.valueobject.Address;
import com.tyreplus.dealer.domain.valueobject.BusinessHours;
import com.tyreplus.dealer.domain.valueobject.ContactDetails;
import com.tyreplus.dealer.infrastructure.persistence.entity.PasswordResetTokenEntity;
import com.tyreplus.dealer.infrastructure.persistence.repository.PasswordResetTokenRepository;
import com.tyreplus.dealer.infrastructure.security.JwtUtil;
import com.tyreplus.dealer.infrastructure.security.RefreshTokenService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.util.Optional;
import java.util.HashSet;
import java.util.UUID;

/**
 * Application service for handling authentication operations.
 */
@Service
public class AuthService {

    private final DealerRepository dealerRepository;
    private final CustomerRepository customerRepository;
    private final WalletRepository walletRepository;
    private final OtpService otpService;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;

    // Constructor updated to include WalletRepository and CustomerRepository
    public AuthService(DealerRepository dealerRepository,
            CustomerRepository customerRepository,
            WalletRepository walletRepository,
            OtpService otpService,
            JwtUtil jwtUtil,
            RefreshTokenService refreshTokenService,
            PasswordEncoder passwordEncoder,
            PasswordResetTokenRepository passwordResetTokenRepository,
            EmailService emailService) {
        this.dealerRepository = dealerRepository;
        this.customerRepository = customerRepository;
        this.walletRepository = walletRepository;
        this.otpService = otpService;
        this.jwtUtil = jwtUtil;
        this.refreshTokenService = refreshTokenService;
        this.passwordEncoder = passwordEncoder;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailService = emailService;
    }

    public String generateOtp(String mobile) {
        return otpService.generateOtp(mobile);
    }

    /**
     * Step 1: Dealer requests a password reset.
     * Generates a secure token, stores it with 15-min expiry, sends email.
     */
    @Transactional
    public void forgotPassword(String identifier) {
        Dealer dealer = dealerRepository.findByPhoneNumberOrEmail(identifier)
                .orElseThrow(() -> new UserNotFoundException(
                        "No dealer account found with: " + identifier));

        // Invalidate any existing tokens for this dealer
        passwordResetTokenRepository.deleteAllByDealerId(dealer.getId());

        // Create a new reset token valid for 15 minutes
        PasswordResetTokenEntity resetToken = PasswordResetTokenEntity.builder()
                .dealerId(dealer.getId())
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .used(false)
                .build();
        passwordResetTokenRepository.save(resetToken);

        // Send email
        String email = dealer.getContactDetails().email();
        String name = dealer.getBusinessName();
        emailService.sendPasswordResetEmail(email, name, resetToken.getToken().toString());
    }

    /**
     * Step 2: Dealer submits new password with token from email.
     */
    @Transactional
    public void resetPassword(String tokenStr, String newPassword) {
        UUID tokenUuid;
        try {
            tokenUuid = UUID.fromString(tokenStr);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid reset token.");
        }

        PasswordResetTokenEntity resetToken = passwordResetTokenRepository.findByToken(tokenUuid)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired reset token."));

        if (resetToken.isUsed()) {
            throw new IllegalArgumentException("This reset link has already been used.");
        }
        if (resetToken.isExpired()) {
            throw new IllegalArgumentException("Reset link has expired. Please request a new one.");
        }

        // Update password
        Dealer dealer = dealerRepository.findById(resetToken.getDealerId())
                .orElseThrow(() -> new IllegalArgumentException("Dealer not found."));

        dealer.setPasswordHash(passwordEncoder.encode(newPassword));
        dealerRepository.save(dealer);

        // Consume the token
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
    }

    /**
     * Login logic: Cleaner exception flow.
     */
    public LoginResponse login(LoginRequest request) {

        Dealer dealer = dealerRepository.findByPhoneNumberOrEmail(request.identifier())
                .orElseThrow(() -> new UserNotFoundException(
                        "Dealer not found with : " + request.identifier() + ". Please register first."));

        // ---- OTP LOGIN ----
        if (request.otp() != null && !request.otp().isBlank()) {
            otpService.validateOtp(dealer.getContactDetails().phoneNumber(), request.otp());
            return issueTokens(dealer);
        }

        // ---- PASSWORD LOGIN ----
        if (request.password() != null && !request.password().isBlank()) {

            if (dealer.getPasswordHash() == null) {
                throw new IllegalArgumentException("Password login not enabled");
            }

            if (!passwordEncoder.matches(request.password(), dealer.getPasswordHash())) {
                throw new IllegalArgumentException("Invalid credentials");
            }

            return issueTokens(dealer);
        }

        // ---- INVALID REQUEST ----
        throw new IllegalArgumentException("Either OTP or password must be provided");
    }

    /**
     * Register logic: Now initializes a Wallet for the new dealer.
     */
    @Transactional
    public LoginResponse register(RegisterRequest request) {
        // 1. Check for duplicates
        if (dealerRepository.existsByMobile(request.mobile())) {
            throw new IllegalArgumentException("Mobile number already registered");
        }
        if (dealerRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already registered");
        }

        // 2. Validate OTP
        otpService.validateOtp(request.mobile(), request.otp());

        // 3. Map Domain Objects
        ContactDetails contactDetails = new ContactDetails(
                request.email(),
                request.mobile(),
                request.whatsapp());

        Address address = new Address(
                request.address().street(),
                request.address().city(),
                request.address().state(),
                request.address().pincode(),
                "India");

        BusinessHours businessHours = new BusinessHours(
                parseTime(request.businessHours().openTime()),
                parseTime(request.businessHours().closeTime()),
                new HashSet<>(request.businessHours().openDays()));

        // 4. Create and Save Dealer WITH Password
        Dealer dealer = Dealer.builder()
                .businessName(request.businessName())
                .ownerName(request.ownerName())
                .isVerified(true) // Auto-verify upon successful OTP registration
                .passwordHash(passwordEncoder.encode(request.password())) // FIX: Encoding the password
                .contactDetails(contactDetails)
                .address(address)
                .businessHours(businessHours)
                .build();

        Dealer savedDealer = dealerRepository.save(dealer);

        // 5. Initialize Wallet
        Wallet wallet = new Wallet(savedDealer.getId(), 0);
        walletRepository.save(wallet);

        // 6. Token generation
        return issueTokens(savedDealer);
    }

    @Transactional
    public void setPassword(UUID dealerId, String rawPassword) {

        Dealer dealer = dealerRepository.findById(dealerId)
                .orElseThrow(() -> new IllegalArgumentException("Dealer not found"));

        dealer.setPasswordHash(passwordEncoder.encode(rawPassword));

        dealerRepository.save(dealer);
    }

    public LoginResponse refresh(String refreshToken) {
        UUID userId = refreshTokenService.validate(refreshToken);

        // Try Dealer repository first
        Optional<Dealer> dealerOpt = dealerRepository.findById(userId);
        if (dealerOpt.isPresent()) {
            Dealer dealer = dealerOpt.get();
            String accessToken = jwtUtil.generateToken(
                    dealer.getContactDetails().phoneNumber(),
                    dealer.getId().toString(),
                    "dealer");
            return new LoginResponse(accessToken, refreshToken, toUserInfo(dealer));
        }

        // Try Customer repository
        Optional<Customer> customerOpt = customerRepository.findById(userId);
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            String accessToken = jwtUtil.generateToken(
                    customer.getMobile(),
                    customer.getId().toString(),
                    "customer");
            return new LoginResponse(accessToken, refreshToken, new LoginResponse.UserInfo(
                    customer.getId().toString(),
                    customer.getName(),
                    "customer",
                    null));
        }

        throw new UserNotFoundException("User not found");
    }

    public void logout(String refreshToken) {
        refreshTokenService.revoke(refreshToken);
    }

    private LoginResponse issueTokens(Dealer dealer) {

        String accessToken = jwtUtil.generateToken(
                dealer.getContactDetails().phoneNumber(),
                dealer.getId().toString(),
                "dealer");

        String refreshToken = refreshTokenService.create(dealer.getId());

        return new LoginResponse(
                accessToken,
                refreshToken,
                toUserInfo(dealer));
    }

    private LoginResponse.UserInfo toUserInfo(Dealer dealer) {
        return new LoginResponse.UserInfo(
                dealer.getId().toString(),
                dealer.getBusinessName(),
                "dealer",
                null);
    }

    /**
     * Quick Login Verify (Auto-register if not exists).
     */
    @Transactional
    public LoginResponse verifyQuickOtp(VerifyOtpRequest request) {
        // 1. Validate OTP
        otpService.validateOtp(request.mobile(), request.otp());

        // 2. Find or Create Dealer
        Dealer dealer = dealerRepository.findByMobile(request.mobile())
                .orElseGet(() -> createGuestDealer(request.mobile()));

        // 3. Issue Tokens
        return issueTokens(dealer);
    }

    private Dealer createGuestDealer(String mobile) {
        // Create a minimal "Guest" dealer
        // Use a placeholder email so the NOT NULL DB constraint is satisfied.
        // This is never used for communication — it's overwritten when the dealer
        // completes their profile.
        ContactDetails contactDetails = new ContactDetails(
                "guest_" + mobile + "@noemail.local",
                mobile,
                null);

        // Placeholder address
        Address address = new Address("Unknown", "Unknown", "Unknown", "000000", "India");

        // Placeholder business hours — default to Mon–Sat
        BusinessHours businessHours = new BusinessHours(
                LocalTime.parse("09:00"),
                LocalTime.parse("21:00"),
                new HashSet<>(java.util.Set.of(
                        java.time.DayOfWeek.MONDAY, java.time.DayOfWeek.TUESDAY,
                        java.time.DayOfWeek.WEDNESDAY, java.time.DayOfWeek.THURSDAY,
                        java.time.DayOfWeek.FRIDAY, java.time.DayOfWeek.SATURDAY)));

        Dealer dealer = Dealer.builder()
                .businessName("Guest Dealer")
                .ownerName("Guest")
                .isVerified(true) // OTP verified means phone is verified
                .contactDetails(contactDetails)
                .address(address)
                .businessHours(businessHours)
                .build();

        Dealer savedDealer = dealerRepository.save(dealer);

        // Initialize Wallet
        Wallet wallet = new Wallet(savedDealer.getId(), 0);
        walletRepository.save(wallet);

        return savedDealer;
    }

    /**
     * Customer OTP Login (Auto-register if not exists).
     */
    @Transactional
    public LoginResponse verifyCustomerOtp(VerifyOtpRequest request) {
        // log the incoming name to help debug mapping issues (see BE-FIX below)
        System.out.println("[AuthService] verifyCustomerOtp received name='" + request.name() + "'");

        // 1. Validate OTP
        otpService.validateOtp(request.mobile(), request.otp());

        // 2. Find or Create Customer
        Customer customer = customerRepository.findByMobile(request.mobile())
                .orElseGet(() -> createCustomer(request.mobile(), request.name()));

        // Update name if provided and different (optional, but good for returning
        // users)
        if (request.name() != null && !request.name().isBlank() && !"Guest".equals(request.name())) {
            customer.setName(request.name());
            customerRepository.save(customer);
        }

        // 3. Issue Tokens
        return issueCustomerTokens(customer);
    }

    private Customer createCustomer(String mobile, String name) {
        Customer customer = Customer.builder()
                .mobile(mobile)
                .name(name != null && !name.isBlank() ? name : "Guest")
                .build();

        return customerRepository.save(customer);
    }

    private LoginResponse issueCustomerTokens(Customer customer) {

        String accessToken = jwtUtil.generateToken(
                customer.getMobile(),
                customer.getId().toString(),
                "customer"); // ROLE is customer

        String refreshToken = refreshTokenService.create(customer.getId());

        return new LoginResponse(
                accessToken,
                refreshToken,
                new LoginResponse.UserInfo(
                        customer.getId().toString(),
                        customer.getName(),
                        "customer",
                        null));
    }

    private LocalTime parseTime(String timeStr) {
        timeStr = timeStr.trim().toUpperCase();
        if (timeStr.contains("AM") || timeStr.contains("PM")) {
            // Use 'hh' for two-digit hours like 09:00
            // Use 'h' for single-digit hours like 9:00
            // To handle both, use a case-insensitive formatter with Locale.ENGLISH
            DateTimeFormatter formatter = new DateTimeFormatterBuilder()
                    .parseCaseInsensitive()
                    .appendPattern("[hh:mm a][h:mm a]") // Handles both 09:00 AM and 9:00 AM
                    .toFormatter(java.util.Locale.ENGLISH);

            return LocalTime.parse(timeStr, formatter);
        } else {
            return LocalTime.parse(timeStr);
        }
    }
}