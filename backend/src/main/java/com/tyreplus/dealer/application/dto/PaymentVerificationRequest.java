package com.tyreplus.dealer.application.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

/**
 * Request received from Mobile App after successful payment UI flow.
 */
public record PaymentVerificationRequest(
        @NotBlank String gatewayOrderId,
        @NotBlank String gatewayPaymentId,
        @NotBlank String gatewaySignature,
        @Min(1) int amount,
        @NotBlank String packageId
) {}

