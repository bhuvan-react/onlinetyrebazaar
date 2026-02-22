package com.tyreplus.dealer.application.dto;

import com.tyreplus.dealer.domain.entity.LeadStatus;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Response DTO for Lead details.
 * Java 21 Record following DDD principles.
 */
public record LeadDetailsResponse(
                UUID id,
                String vehicleType,
                String tyreType,
                String tyreBrand,
                String vehicleModel,
                String locationArea,
                String locationPincode,
                LeadStatus status,

                // Only visible to the dealer IF they are the selectedDealerId
                String customerMobile,

                UUID selectedDealerId,
                LocalDateTime createdAt,
                LocalDateTime verifiedAt) {
}
