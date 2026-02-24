package com.tyreplus.dealer.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LeadRequest(
        @NotBlank(message = "Vehicle type is required") String vehicleType,

        @NotBlank(message = "Tyre type is required") String tyreType,

        @NotBlank(message = "Tyre brand is required") String tyreBrand,

        String vehicleModel,

        @NotBlank(message = "Location area is required") String locationArea,

        @NotBlank(message = "Pincode is required") @Size(min = 6, max = 6, message = "Pincode must be 6 digits") String locationPincode,

        // Optional extended fields from frontend
        String tyreSize,
        String tyrePosition,
        String urgency,
        java.util.List<String> issues,
        String usageType,
        String budget,
        java.util.List<String> preferences,
        String serviceRequirement,
        Integer quantity,
        String tyreId) {
}
