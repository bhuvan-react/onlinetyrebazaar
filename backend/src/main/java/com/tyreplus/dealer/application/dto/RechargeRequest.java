package com.tyreplus.dealer.application.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for Wallet Recharge.
 * Java 21 Record with Jakarta Validation.
 */
public record RechargeRequest(
        @NotNull(message = "Package ID is required")
        String packageId
) {
}

