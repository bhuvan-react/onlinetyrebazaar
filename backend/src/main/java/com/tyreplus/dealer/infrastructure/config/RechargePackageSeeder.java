package com.tyreplus.dealer.infrastructure.config;

import com.tyreplus.dealer.domain.entity.RechargePackage;
import com.tyreplus.dealer.domain.repository.RechargePackageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(3)
@Profile("local")
@RequiredArgsConstructor
public class RechargePackageSeeder implements CommandLineRunner {

    private final RechargePackageRepository packageRepository;

    @Override
    public void run(String... args) {

        // Avoid reseeding if packages already exist
        if (!packageRepository.findActivePackages().isEmpty()) {
            return;
        }

        packageRepository.save(RechargePackage.builder()
                .name("Starter")
                .priceInInr(500)
                .baseCredits(500)
                .popular(false)
                .active(true)
                .build());

        packageRepository.save(RechargePackage.builder()
                .name("Growth")
                .priceInInr(2000)
                .baseCredits(2000)
                .popular(true)
                .active(true)
                .build());

        packageRepository.save(RechargePackage.builder()
                .name("Premium")
                .priceInInr(5000)
                .baseCredits(5000)
                .popular(false)
                .active(true)
                .build());

        System.out.println("✅ Recharge packages seeded (dev profile)");
    }
}
