package com.tyreplus.dealer.application.service;

import com.tyreplus.dealer.application.dto.DealerProfileResponse;
import com.tyreplus.dealer.application.dto.UpdateDealerProfileRequest;
import com.tyreplus.dealer.domain.entity.Dealer;
import com.tyreplus.dealer.domain.repository.DealerRepository;
import com.tyreplus.dealer.domain.valueobject.Address;
import com.tyreplus.dealer.domain.valueobject.BusinessHours;
import com.tyreplus.dealer.domain.valueobject.ContactDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.UUID;


/**
 * Application service for handling dealer profile operations.
 */
@Service
public class DealerProfileService {

    private final DealerRepository dealerRepository;

    public DealerProfileService(DealerRepository dealerRepository) {
        this.dealerRepository = dealerRepository;
    }

    @Transactional(readOnly = true)
    public DealerProfileResponse getProfile(UUID dealerId) {
        Dealer dealer = dealerRepository.findById(dealerId)
                .orElseThrow(() -> new IllegalArgumentException("Dealer not found with id: " + dealerId));
        return mapToResponse(dealer);
    }

    @Transactional
    public DealerProfileResponse updateProfile(UUID dealerId, UpdateDealerProfileRequest request) {
        // 1. Fetch current domain entity
        Dealer dealer = dealerRepository.findById(dealerId)
                .orElseThrow(() -> new IllegalArgumentException("Dealer not found with id: " + dealerId));

        // 2. Update basic identity fields
        dealer.setBusinessName(request.businessName());
        dealer.setOwnerName(request.ownerName());

        // 3. Update Contact Details (Keep mobile immutable for security/identity)
        ContactDetails contactDetails = new ContactDetails(
                request.email(),
                dealer.getContactDetails().phoneNumber(), // Do not allow mobile change here
                request.whatsapp()
        );
        dealer.updateContactDetails(contactDetails);

        // 4. Update Address using the Value Object
        Address address = new Address(
                request.address().street(),
                request.address().city(),
                request.address().state(),
                request.address().pincode(),
                "India"
        );
        dealer.setAddress(address);

        // 5. Update Business Hours
        BusinessHours businessHours = new BusinessHours(
                parseTime(request.businessHours().openTime()),
                parseTime(request.businessHours().closeTime()),
                new HashSet<>(request.businessHours().openDays())
        );
        dealer.updateBusinessHours(businessHours);

        // 6. Save and map the result directly (avoids an extra SELECT query)
        Dealer saved = dealerRepository.save(dealer);
        return mapToResponse(saved);
    }

    private DealerProfileResponse mapToResponse(Dealer dealer) {
        return new DealerProfileResponse(
                dealer.getId() != null ? dealer.getId().toString() : null,
                dealer.getBusinessName(),
                dealer.getOwnerName(),
                dealer.isVerified(),
                dealer.getContactDetails() != null ? dealer.getContactDetails().phoneNumber() : "",
                dealer.getContactDetails() != null ? dealer.getContactDetails().email() : "",
                dealer.getAddress() != null ? dealer.getAddress().getFullAddress() : "",
                null // Avatar Placeholder
        );
    }

    private LocalTime parseTime(String timeStr) {
        timeStr = timeStr.trim().toUpperCase();
        try {
            if (timeStr.contains("AM") || timeStr.contains("PM")) {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a");
                // Remove potential space before AM/PM for strict parsing if needed
                return LocalTime.parse(timeStr, formatter);
            }
            return LocalTime.parse(timeStr);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid time format: " + timeStr + ". Use HH:mm or hh:mm AM/PM");
        }
    }
}