package com.tyreplus.dealer.infrastructure.persistence.repository;

import com.tyreplus.dealer.infrastructure.persistence.entity.LeadPurchaseJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LeadPurchaseJpaRepository extends JpaRepository<LeadPurchaseJpaEntity, UUID> {

    boolean existsByLeadIdAndDealerId(UUID leadId, UUID dealerId);

    List<LeadPurchaseJpaEntity> findByDealerId(UUID dealerId);

    List<LeadPurchaseJpaEntity> findByLeadId(UUID leadId);

    java.util.Optional<LeadPurchaseJpaEntity> findByLeadIdAndDealerId(UUID leadId, UUID dealerId);
}
