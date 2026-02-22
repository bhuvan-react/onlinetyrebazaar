package com.tyreplus.dealer.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * Request DTO for Quick OTP Verification.
 */
public record VerifyOtpRequest(
                @NotBlank(message = "Mobile number is required") @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be 10 digits") String mobile,

                @NotBlank(message = "OTP is required") @Pattern(regexp = "^[0-9]{4,6}$", message = "OTP must be 4 to 6 digits") String otp) {
}
