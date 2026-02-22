package com.tyreplus.dealer.application.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.DayOfWeek;
import java.util.List;

/**
 * Request DTO for dealer registration.
 * Java 21 Record with Jakarta Validation.
 */
public record RegisterRequest(
                @NotBlank(message = "Business name is required") String businessName,

                @NotBlank(message = "Owner name is required") String ownerName,

                @NotBlank(message = "Mobile number is required") @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be 10 digits") String mobile,

                @NotBlank(message = "Email is required") @Email(message = "Email must be valid") String email,

                @NotBlank(message = "OTP is required") @Pattern(regexp = "^[0-9]{4,6}$", message = "OTP must be 4 to 6 digits") String otp,

                String whatsapp,

                @NotBlank(message = "Password is required") String password,

                @Valid @NotNull(message = "Address is required") AddressRequest address,

                @Valid @NotNull(message = "Business hours are required") BusinessHoursRequest businessHours) {
        public record AddressRequest(
                        String shopNumber,
                        @NotBlank(message = "Street is required") String street,
                        @NotBlank(message = "City is required") String city,
                        @NotBlank(message = "State is required") String state,
                        @NotBlank(message = "Pincode is required") @Pattern(regexp = "^[0-9]{6}$", message = "Pincode must be 6 digits") String pincode,
                        String landmark) {
        }

        public record BusinessHoursRequest(
                        @NotBlank(message = "Open time is required") String openTime,
                        @NotBlank(message = "Close time is required") String closeTime,
                        @NotNull(message = "Open days are required") @Size(min = 1, message = "At least one open day is required") List<DayOfWeek> openDays) {
        }
}
