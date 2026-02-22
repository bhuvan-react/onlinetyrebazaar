package com.tyreplus.dealer.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "tyres")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TyreJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String pattern;

    @Column(nullable = false)
    private String size;

    @Column(nullable = false)
    private Double price;

    @Column(name = "product_code", unique = true)
    private String productCode;

    // Storing features as comma-separated string for simplicity in MVP
    @Column(name = "features")
    private String features;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "warranty_years")
    private Integer warrantyYears;

    // Extended pricing fields
    @Column(name = "new_price")
    private Double newPrice;

    @Column(name = "used_price")
    private Double usedPrice;

    @Column(name = "original_price")
    private Double originalPrice;

    // Rating and reviews
    @Column(name = "rating")
    private Double rating;

    @Column(name = "review_count")
    private Integer reviewCount;

    // Stock and type
    @Column(name = "type")
    private String type; // "new" or "used"

    @Column(name = "in_stock")
    private Boolean inStock;

    // Used tyre specific fields
    @Column(name = "condition")
    private String condition;

    @Column(name = "tread_depth")
    private Integer treadDepth;

    @Column(name = "free_installation")
    private Boolean freeInstallation;
}
