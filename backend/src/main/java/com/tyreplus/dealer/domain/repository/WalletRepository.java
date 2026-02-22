package com.tyreplus.dealer.domain.repository;

import com.tyreplus.dealer.domain.entity.Wallet;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for Wallet entity.
 * Part of the domain layer - no framework dependencies.
 */
public interface WalletRepository {
    Wallet save(Wallet wallet);
    Optional<Wallet> findByDealerId(UUID dealerId);
    Optional<Wallet> findByDealerIdWithLock(UUID dealerId);
    Optional<Wallet> findById(UUID id);
    boolean existsByDealerId(UUID dealerId);
    void deleteById(UUID id);
}

