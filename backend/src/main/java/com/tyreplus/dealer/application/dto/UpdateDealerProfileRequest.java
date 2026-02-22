package com.tyreplus.dealer.application.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.DayOfWeek;
import java.util.Set;

/**
 * Request DTO for updating Dealer Profile.
 * Java 21 Record with Jakarta Validation.
 */
public record UpdateDealerProfileRequest(
        @NotBlank(message = "Business name is required")
        String businessName,
        
        @NotBlank(message = "Owner name is required")
        String ownerName,
        
        String gstNumber,
        
        Integer yearsInBusiness,
        
        @NotBlank(message = "Mobile number is required")
        String mobile,
        
        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        String email,
        
        String whatsapp,
        
        @Valid
        @NotNull(message = "Address is required")
        AddressRequest address,
        
        @Valid
        @NotNull(message = "Business hours are required")
        BusinessHoursRequest businessHours,
        
        java.util.List<String> services,
        
        java.util.List<String> brands
) {
    public record AddressRequest(
            String shopNumber,
            @NotBlank(message = "Street is required")
            String street,
            @NotBlank(message = "City is required")
            String city,
            @NotBlank(message = "State is required")
            String state,
            @NotBlank(message = "Pincode is required")
            String pincode,
            String landmark
    ) {
    }
    
    public record BusinessHoursRequest(
            @NotBlank(message = "Open time is required")
            String openTime,
            @NotBlank(message = "Close time is required")
            String closeTime,
            @NotNull(message = "Open days are required")
            Set<DayOfWeek> openDays
    ) {
    }
}

