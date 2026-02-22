package com.tyreplus.dealer.application.dto;

/**
 * Response DTO for Dealer Profile.
 * Java 21 Record following DDD principles.
 */
public record DealerProfileResponse(
        String id,
        String businessName,
        String ownerName,
        boolean isVerified,
        String mobile,
        String email,
        String address,
        String avatar
) {
}

