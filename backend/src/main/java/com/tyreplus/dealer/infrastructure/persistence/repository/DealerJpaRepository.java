package com.tyreplus.dealer.infrastructure.persistence.repository;

import com.tyreplus.dealer.infrastructure.persistence.entity.DealerJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

/**
 * Spring Data JPA repository for DealerJpaEntity.
 */
@Repository
public interface DealerJpaRepository extends JpaRepository<DealerJpaEntity, UUID> {
    Optional<DealerJpaEntity> findByPhoneNumber(String phoneNumber);

    Optional<DealerJpaEntity> findByEmail(String email);

    Optional<DealerJpaEntity> findByPhoneNumberOrEmail(String phoneNumber, String email);

    List<DealerJpaEntity> findByIsVerifiedFalse();

    boolean existsByPhoneNumber(String phoneNumber);

    boolean existsByEmail(String email);
}
