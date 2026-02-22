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
import com.tyreplus.dealer.infrastructure.security.JwtUtil;
import com.tyreplus.dealer.infrastructure.security.RefreshTokenService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
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

    // Constructor updated to include WalletRepository and CustomerRepository
    public AuthService(DealerRepository dealerRepository,
            CustomerRepository customerRepository,
            WalletRepository walletRepository,
            OtpService otpService,
            JwtUtil jwtUtil,
            RefreshTokenService refreshTokenService,
            PasswordEncoder passwordEncoder) {
        this.dealerRepository = dealerRepository;
        this.customerRepository = customerRepository;
        this.walletRepository = walletRepository;
        this.otpService = otpService;
        this.jwtUtil = jwtUtil;
        this.refreshTokenService = refreshTokenService;
        this.passwordEncoder = passwordEncoder;
    }

    public String generateOtp(String mobile) {
        return otpService.generateOtp(mobile);
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

        UUID dealerId = refreshTokenService.validate(refreshToken);

        Dealer dealer = dealerRepository.findById(dealerId)
                .orElseThrow(() -> new UserNotFoundException("Dealer not found"));

        String accessToken = jwtUtil.generateToken(
                dealer.getContactDetails().phoneNumber(),
                dealer.getId().toString(),
                "dealer");

        return new LoginResponse(accessToken, refreshToken, toUserInfo(dealer));
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
        // 1. Validate OTP
        otpService.validateOtp(request.mobile(), request.otp());

        // 2. Find or Create Customer
        Customer customer = customerRepository.findByMobile(request.mobile())
                .orElseGet(() -> createGuestCustomer(request.mobile()));

        // 3. Issue Tokens
        return issueCustomerTokens(customer);
    }

    private Customer createGuestCustomer(String mobile) {
        Customer customer = Customer.builder()
                .mobile(mobile)
                .name("Guest")
                .build();

        return customerRepository.save(customer);
    }

    private LoginResponse issueCustomerTokens(Customer customer) {

        String accessToken = jwtUtil.generateToken(
                customer.getMobile(),
                customer.getId().toString(),
                "customer"); // ROLE is customer

        // Depending on whether we want long-term sessions for customers
        // For MVP, using a dummy UUID for refresh token as they log in via OTP each
        // time
        String refreshToken = UUID.randomUUID().toString();

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