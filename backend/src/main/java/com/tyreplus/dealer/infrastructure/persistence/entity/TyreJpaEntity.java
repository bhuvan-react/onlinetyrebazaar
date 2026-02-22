package com.tyreplus.dealer.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;
import java.util.List;

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
    // or better as ElementCollection if supported, but simple string is safer for
    // quick impl
    @Column(name = "features")
    private String features;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "warranty_years")
    private Integer warrantyYears;
}
