package com.tyreplus.dealer.application.dto;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Response DTO returned to customers when they view which dealers have
 * purchased/unlocked their lead.
 */
public record DealerPurchaserResponse(
        UUID dealerId,
        String businessName,
        String ownerName,
        String phone,
        String email,
        String zipCode,
        String city,
        LocalDateTime purchasedAt) {
}
