package com.tyreplus.dealer.domain.entity;

import lombok.*;
import java.util.UUID;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Tyre {
    private UUID id;
    private String brand;
    private String pattern;
    private String size;
    private Double price;
    private String productCode;
    private List<String> features;
    private String imageUrl;
    private Integer warrantyYears;

    // Extended pricing
    private Double newPrice;
    private Double usedPrice;
    private Double originalPrice;

    // Rating and reviews
    private Double rating;
    private Integer reviewCount;

    // Stock and type
    private String type; // "new" or "used"
    private Boolean inStock;

    // Used tyre specific
    private String condition;
    private Integer treadDepth;
    private Boolean freeInstallation;
}
