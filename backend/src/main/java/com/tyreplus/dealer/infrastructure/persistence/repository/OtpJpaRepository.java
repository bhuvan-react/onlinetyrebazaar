package com.tyreplus.dealer.infrastructure.persistence.repository;

import com.tyreplus.dealer.infrastructure.persistence.entity.OtpJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA repository for OtpJpaEntity.
 */
@Repository
public interface OtpJpaRepository extends JpaRepository<OtpJpaEntity, UUID> {
    Optional<OtpJpaEntity> findByMobileAndCode(String mobile, String code);
    List<OtpJpaEntity> findByMobileOrderByCreatedAtDesc(String mobile);
    
    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM OtpJpaEntity o WHERE o.mobile = :mobile")
    void deleteByMobile(@Param("mobile") String mobile);
    
    @Modifying
    @Query("DELETE FROM OtpJpaEntity o WHERE o.expiresAt < :now")
    void deleteExpiredOtp(@Param("now") LocalDateTime now);
}

