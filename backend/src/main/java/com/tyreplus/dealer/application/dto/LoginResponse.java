package com.tyreplus.dealer.application.dto;

/**
 * Response DTO for Login.
 * Java 21 Record following DDD principles.
 */
public record LoginResponse(
        String token,
        String refreshToken,
        UserInfo user
) {
    public record UserInfo(
            String id,
            String name,
            String role,
            String avatar
    ) {
    }
}

