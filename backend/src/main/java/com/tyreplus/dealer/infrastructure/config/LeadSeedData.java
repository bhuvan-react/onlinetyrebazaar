package com.tyreplus.dealer.infrastructure.config;

import com.tyreplus.dealer.domain.entity.Lead;
import com.tyreplus.dealer.domain.entity.LeadStatus;
import com.tyreplus.dealer.domain.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Seeds sample lead data into the database on startup if no leads exist.
 */
@Component
@RequiredArgsConstructor
@Slf4j
@Profile("local")
@Order(2)
public class LeadSeedData implements CommandLineRunner {

    private final LeadRepository leadRepository;

    @Override
    @Transactional
    public void run(String... args) {
        // Only check count; it's more efficient than loading all leads
        if (leadRepository.count() == 0) {
            log.info("Database empty. Seeding sample leads for TyrePlus...");

            List<Lead> sampleLeads = List.of(
                    createLead("9876543210", "4W", "New", "Maruti Suzuki Swift", "Indiranagar", "560038"),
                    createLead("9988776655", "2W", "Used", "Honda Activa", "Koramangala", "560034"),
                    createLead("9123456789", "4W", "New", "Hyundai Creta", "HSR Layout", "560102"));

            leadRepository.saveAll(sampleLeads);
            leadRepository.flush();
            log.info("Successfully seeded {} leads.", sampleLeads.size());
        } else {
            log.info("Leads already exist. Skipping seed.");
        }
    }

    private Lead createLead(String phone, String vType, String tType, String model, String area, String pin) {
        return Lead.builder()
                .customerId(UUID.randomUUID())
                .customerMobile(phone)
                .vehicleType(vType)
                .tyreType(tType)
                .vehicleModel(model)
                .locationArea(area)
                .locationPincode(pin)
                .status(LeadStatus.NEW)
                .createdAt(LocalDateTime.now().minusHours((long) (Math.random() * 48))) // Random time in last 2 days
                .build();
    }
}
