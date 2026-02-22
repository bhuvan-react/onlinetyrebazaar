package com.tyreplus.dealer.application.dto;

/**
 * Response DTO for OTP generation.
 * Java 21 Record following DDD principles.
 */
public record OtpResponse(
                String message,
                String otp) {
}
