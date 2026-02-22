package com.tyreplus.dealer.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "quote_requests")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuoteRequestJpaEntity {
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
    private String details;

    @Column(name = "vehicle_id")
    private UUID vehicleId;

    @Column(name = "tyre_id")
    private UUID tyreId;
}
