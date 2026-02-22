package com.tyreplus.dealer.infrastructure.persistence.repository;

import com.tyreplus.dealer.infrastructure.persistence.entity.WalletJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA repository for WalletJpaEntity.
 */
@Repository
public interface WalletJpaRepository extends JpaRepository<WalletJpaEntity, UUID> {
    Optional<WalletJpaEntity> findByDealerId(UUID dealerId);
    
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT w FROM WalletJpaEntity w WHERE w.dealerId = :dealerId")
    Optional<WalletJpaEntity> findByDealerIdWithLock(@Param("dealerId") UUID dealerId);
    
    boolean existsByDealerId(UUID dealerId);
}

