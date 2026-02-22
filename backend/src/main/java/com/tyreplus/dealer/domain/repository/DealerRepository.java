package com.tyreplus.dealer.domain.repository;

import com.tyreplus.dealer.domain.entity.Dealer;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

/**
 * Repository interface for Dealer entity.
 * Part of the domain layer - no framework dependencies.
 */
public interface DealerRepository {
    Dealer save(Dealer dealer);

    Optional<Dealer> findById(UUID id);

    Optional<Dealer> findByMobile(String mobile);

    Optional<Dealer> findByPhoneNumberOrEmail(String identifier);

    Optional<Dealer> findByEmail(String email);

    List<Dealer> findByIsVerifiedFalse();

    boolean existsById(UUID id);

    boolean existsByMobile(String mobile);

    boolean existsByEmail(String email);

    void deleteById(UUID id);
}
