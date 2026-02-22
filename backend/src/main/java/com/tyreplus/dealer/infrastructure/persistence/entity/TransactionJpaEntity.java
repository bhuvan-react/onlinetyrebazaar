package com.tyreplus.dealer.infrastructure.persistence.entity;

import com.tyreplus.dealer.domain.entity.TransactionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * JPA Entity for Transaction Ledger.
 * Immutable record of credit/debit operations.
 */
@Entity
@Table(name = "transactions")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "wallet_id", nullable = false)
    private UUID walletId;

    @Column(name = "dealer_id", nullable = false)
    private UUID dealerId;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private TransactionType type;

    /**
     * Total Credits credited or debited.
     */
    @Column(name = "credits", nullable = false)
    private int credits;

    @Column(name = "purchased_credits", nullable = false)
    private int purchasedCredits;

    @Column(name = "bonus_credits", nullable = false)
    private int bonusCredits;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "payment_id", length = 255) // Added for unique constraint
    private String paymentId;

    /**
     * Ledger timestamp (auto-set).
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
