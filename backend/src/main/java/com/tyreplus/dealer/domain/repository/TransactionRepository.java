package com.tyreplus.dealer.domain.repository;

import com.tyreplus.dealer.domain.entity.Transaction;

import java.util.List;
import java.util.UUID;

/**
 * Repository interface for Transaction entity.
 * Part of the domain layer - no framework dependencies.
 */
public interface TransactionRepository {
    Transaction save(Transaction transaction);

    List<Transaction> findByDealerId(UUID dealerId);

    List<Transaction> findByWalletId(UUID walletId);

    boolean existsByPaymentId(String paymentId);
}
