package com.tyreplus.dealer.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * JPA Entity for dealer lead purchases.
 * Each row = one dealer who paid to unlock the lead.
 */
@Entity
@Table(name = "lead_purchases", uniqueConstraints = @UniqueConstraint(columnNames = { "lead_id", "dealer_id" }))
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadPurchaseJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "UUID")
    private UUID id;

    @Column(name = "lead_id", nullable = false, columnDefinition = "UUID")
    private UUID leadId;

    @Column(name = "dealer_id", nullable = false, columnDefinition = "UUID")
    private UUID dealerId;

    @Column(name = "cost_paid", nullable = false)
    private int costPaid;

    @CreationTimestamp
    @Column(name = "purchased_at", nullable = false, updatable = false)
    private LocalDateTime purchasedAt;
}
