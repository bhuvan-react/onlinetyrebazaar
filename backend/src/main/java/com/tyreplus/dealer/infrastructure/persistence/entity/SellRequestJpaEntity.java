package com.tyreplus.dealer.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "sell_requests")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SellRequestJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "dealer_id", nullable = false)
    private UUID dealerId;

    @Column(name = "request_number", unique = true)
    private String requestNumber;

    @Column(name = "request_date")
    private LocalDateTime requestDate;

    private String status;

    @Column(name = "tyre_brand")
    private String tyreBrand;

    @Column(name = "tyre_size")
    private String tyreSize;

    @Column(name = "tyre_pattern")
    private String tyrePattern;

    private String condition;
    private Integer quantity;

    @Column(name = "expected_price")
    private Double expectedPrice;

    // Comma separated images for MVP
    @Column(name = "image_urls")
    private String imageUrls;

    @Column(name = "vehicle_type")
    private String vehicleType;

    @Column(name = "tyre_age")
    private String tyreAge;

    @Column(name = "km_driven")
    private Integer kmDriven;

    @Column(name = "pickup_date")
    private String pickupDate;

    @Column(name = "pickup_time_slot")
    private String pickupTimeSlot;

    private String mobile;
}
