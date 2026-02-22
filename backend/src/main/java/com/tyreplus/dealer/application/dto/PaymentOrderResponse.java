package com.tyreplus.dealer.application.dto;

/**
 * Response sent to Mobile App after creating an order with Razorpay.
 */
public record PaymentOrderResponse(
                String orderId,
                int amount,
                String currency,
                String key,
                String packageName) {
}