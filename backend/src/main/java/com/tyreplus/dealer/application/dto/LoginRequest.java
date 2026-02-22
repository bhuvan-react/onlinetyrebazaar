package com.tyreplus.dealer.application.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO for Login.
 * Java 21 Record with Jakarta Validation.
 */
public record LoginRequest(
                @NotBlank(message = "Mobile number/Email is required") String identifier,
                String otp,
                String password) {
        public boolean isOtpLogin() {
                return otp != null && !otp.isBlank();
        }

        public boolean isPasswordLogin() {
                return password != null && !password.isBlank();
        }

}
