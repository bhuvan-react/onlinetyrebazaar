package com.tyreplus.dealer.infrastructure.persistence.repository;

import com.tyreplus.dealer.infrastructure.persistence.entity.TransactionJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Spring Data JPA repository for TransactionJpaEntity.
 */
@Repository
public interface TransactionJpaRepository extends JpaRepository<TransactionJpaEntity, UUID> {
    List<TransactionJpaEntity> findByDealerIdOrderByCreatedAtDesc(UUID dealerId);

    List<TransactionJpaEntity> findByWalletIdOrderByCreatedAtDesc(UUID walletId);

    boolean existsByPaymentId(String paymentId);
}
