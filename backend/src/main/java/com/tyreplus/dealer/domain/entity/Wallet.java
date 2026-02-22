package com.tyreplus.dealer.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

/**
 * Domain Entity representing a Wallet.
 * Pure domain model without JPA annotations.
 */
@Getter
@Setter
@Builder
@AllArgsConstructor
public class Wallet {
    private UUID id;
    private UUID dealerId;
    private int purchasedCredits;
    private int bonusCredits;
    private Long version;

    public Wallet(UUID dealerId, int initialPurchasedBalance) {
        this.dealerId = dealerId;
        this.purchasedCredits = initialPurchasedBalance;
        this.bonusCredits = 0;
    }

    public int getTotalCredits() {
        return this.purchasedCredits + this.bonusCredits;
    }

    public boolean canAfford(int cost) {
        return getTotalCredits() >= cost;
    }

    public record DeductionBreakdown(int purchased, int bonus) {
    }

    public DeductionBreakdown deduct(int amount) {
        if (amount < 0)
            throw new IllegalArgumentException("Amount cannot be negative");
        if (!canAfford(amount))
            throw new IllegalStateException("Insufficient funds");

        int usedBonus = 0;
        int usedPurchased = 0;

        // Strategy: Use Purchased Credits first
        if (this.purchasedCredits >= amount) {
            this.purchasedCredits -= amount;
            usedPurchased = amount;
        } else {
            usedPurchased = this.purchasedCredits;
            int remainingToDeduct = amount - this.purchasedCredits;
            this.purchasedCredits = 0;
            this.bonusCredits -= remainingToDeduct;
            usedBonus = remainingToDeduct;
        }
        return new DeductionBreakdown(usedPurchased, usedBonus);
    }

    public void credit(int purchased, int bonus) {
        this.purchasedCredits += purchased;
        this.bonusCredits += bonus;
    }

}
