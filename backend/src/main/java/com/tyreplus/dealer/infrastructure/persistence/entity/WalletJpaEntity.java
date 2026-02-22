package com.tyreplus.dealer.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

/**
 * JPA Entity for Wallet.
 * Wallet stores ONLY credits (not money).
 * */
@Entity
@Table(
        name = "wallets",
        uniqueConstraints = @UniqueConstraint(columnNames = "dealer_id")
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WalletJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "dealer_id", nullable = false, unique = true)
    private UUID dealerId;

    @Column(name = "purchased_credits", nullable = false)
    private int purchasedCredits; // Credits bought with real INR

    @Column(name = "bonus_credits", nullable = false)
    private int bonusCredits; // Promotional/Discount credits

    /**
     * Optimistic locking (secondary safety).
     */
    @Version
    @Column(name = "version", nullable = false)
    private Long version;
}

