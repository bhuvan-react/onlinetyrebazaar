package com.tyreplus.dealer.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * Request DTO for OTP generation.
 * Java 21 Record with Jakarta Validation.
 */
public record OtpRequest(
        @NotBlank(message = "Mobile number is required")
        @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be 10 digits")
        String mobile
) {
}

