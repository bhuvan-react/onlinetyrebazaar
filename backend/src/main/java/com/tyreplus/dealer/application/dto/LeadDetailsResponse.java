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
                String vehicleYear,
                String locationArea,
                String locationPincode,
                String tyreSize,
                LeadStatus status,

                // Only visible to the dealer IF they are the selectedDealerId
                String customerMobile,

                UUID selectedDealerId,
                LocalDateTime createdAt,
                LocalDateTime verifiedAt,

                // New fields for mobile app
                String customerName,
                String serviceRequest,
                UUID tyreId,
                java.util.List<QuestionnaireItem> questionnaire,
                AssociatedTyreInfo tyreInfo) {

        public record QuestionnaireItem(String id, String question, Object answer) {
        }

        public record AssociatedTyreInfo(UUID id, String brand, String pattern, String size, String type, Double price,
                        String imageUrl) {
        }
}
