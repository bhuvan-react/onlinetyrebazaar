package com.tyreplus.dealer.infrastructure.persistence.repository;

import com.tyreplus.dealer.infrastructure.persistence.entity.PasswordResetTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetTokenEntity, UUID> {

    Optional<PasswordResetTokenEntity> findByToken(UUID token);

    @Modifying
    @Transactional
    @Query("DELETE FROM PasswordResetTokenEntity t WHERE t.dealerId = :dealerId")
    void deleteAllByDealerId(UUID dealerId);
}
