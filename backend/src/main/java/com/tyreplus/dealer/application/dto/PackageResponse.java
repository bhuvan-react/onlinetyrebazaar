package com.tyreplus.dealer.application.dto;

/**
 * Response DTO for Package.
 * Java 21 Record following DDD principles.
 */
public record PackageResponse(
        String id,
        String name,
        int price,
        int credits,
        boolean isPopular
) {
}

