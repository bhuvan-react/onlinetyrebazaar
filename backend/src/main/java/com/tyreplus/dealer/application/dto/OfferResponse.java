package com.tyreplus.dealer.application.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record OfferResponse(
        UUID id,
        UUID leadId,
        UUID dealerId,
        int price,
        String tyreCondition,
        boolean stockAvailable,
        List<String> imageUrls,
        LocalDateTime createdAt) {
}
