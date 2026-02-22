package com.tyreplus.dealer.infrastructure.config;

import com.tyreplus.dealer.domain.entity.Dealer;
import com.tyreplus.dealer.domain.entity.Wallet;
import com.tyreplus.dealer.domain.repository.DealerRepository;
import com.tyreplus.dealer.domain.repository.WalletRepository;
import com.tyreplus.dealer.domain.valueobject.Address;
import com.tyreplus.dealer.domain.valueobject.BusinessHours;
import com.tyreplus.dealer.domain.valueobject.ContactDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;

@Component
@RequiredArgsConstructor
@Profile("local")
@Order(1)
public class DealerSeedData implements CommandLineRunner {

    private final DealerRepository dealerRepository;
    private final WalletRepository walletRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    private static final DateTimeFormatter TIME_FORMATTER =
            DateTimeFormatter.ofPattern("hh:mm a", java.util.Locale.ENGLISH);

    @Override
    @Transactional
    public void run(String... args) {
        String testMobile = "9876543210";
        String defaultPassword = "Test@123";

        // Find existing dealer or create a new one
        Dealer dealer = dealerRepository.findByPhoneNumberOrEmail(testMobile)
                .orElseGet(() -> createNewDealer(testMobile));

        // ALWAYS update the password for local testing if it's missing or needs resetting
        dealer.setPasswordHash(passwordEncoder.encode(defaultPassword));
        dealer.setVerified(true); // Ensure dealer is verified for login

        Dealer savedDealer = dealerRepository.save(dealer);

        // Ensure a wallet exists for this dealer
        if (!walletRepository.existsByDealerId(savedDealer.getId())) {
            walletRepository.save(new Wallet(savedDealer.getId(), 5000));
        }

        System.out.println("✅ Dealer Synchronized: " + savedDealer.getBusinessName());
        System.out.println("🔑 Test Credentials -> Mobile: " + testMobile + ", Password: " + defaultPassword);
    }

    private Dealer createNewDealer(String mobile) {
        return Dealer.builder()
                .businessName("Super Tyres Ltd.")
                .ownerName("Rajesh Kumar")
                .contactDetails(new ContactDetails("dealer@supertyres.com", mobile, mobile))
                .address(new Address("123, MG Road", "Bangalore", "Karnataka", "560001", "India"))
                .businessHours(new BusinessHours(
                        LocalTime.parse("09:00 AM", TIME_FORMATTER),
                        LocalTime.parse("09:00 PM", TIME_FORMATTER),
                        new HashSet<>(List.of(DayOfWeek.SUNDAY, DayOfWeek.MONDAY))
                ))
                .build();
    }
}