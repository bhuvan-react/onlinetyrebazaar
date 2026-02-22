package com.tyreplus.dealer.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * domain entity representing a Transaction.
 * Records every credit/debit operation on a wallet.
 */
@Getter
@Setter
@Builder
@AllArgsConstructor
public class Transaction {
    private UUID id;
    private UUID walletId;
    private UUID dealerId;
    private TransactionType type;
    private int credits; // Added back to store total
    private int purchasedCredits;
    private int bonusCredits;
    private String description;
    private String paymentId; // Added for idempotency
    private LocalDateTime timestamp;

    public Transaction() {
        this.timestamp = LocalDateTime.now();
    }

    public Transaction(UUID walletId, UUID dealerId, TransactionType type, int totalCredits, int purchasedCredits,
            int bonusCredits, String description, String paymentId) {
        this();
        this.walletId = walletId;
        this.dealerId = dealerId;
        this.type = type;
        this.credits = totalCredits;
        this.purchasedCredits = purchasedCredits;
        this.bonusCredits = bonusCredits;
        this.description = description;
        this.paymentId = paymentId;
    }
}
