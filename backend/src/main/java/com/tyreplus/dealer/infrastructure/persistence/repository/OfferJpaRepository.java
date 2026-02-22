package com.tyreplus.dealer.infrastructure.persistence.repository;

import com.tyreplus.dealer.infrastructure.persistence.entity.OfferJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OfferJpaRepository extends JpaRepository<OfferJpaEntity, UUID> {
    List<OfferJpaEntity> findByLeadId(UUID leadId);

    List<OfferJpaEntity> findByDealerId(UUID dealerId);

    boolean existsByLeadIdAndDealerId(UUID leadId, UUID dealerId);
}
