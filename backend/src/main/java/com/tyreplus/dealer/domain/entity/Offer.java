package com.tyreplus.dealer.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class Offer {
    private UUID id;
    private UUID leadId;
    private UUID dealerId;
    private int price;
    private String tyreCondition; // New, Used (Excellent / Good / Cheap)
    private boolean stockAvailable;
    private List<String> imageUrls;
    private LocalDateTime createdAt;

    public Offer() {
        this.createdAt = LocalDateTime.now();
    }
}
