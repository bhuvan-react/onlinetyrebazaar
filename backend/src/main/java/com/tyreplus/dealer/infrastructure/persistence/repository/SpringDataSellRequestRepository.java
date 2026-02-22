package com.tyreplus.dealer.infrastructure.persistence.repository;

import com.tyreplus.dealer.infrastructure.persistence.entity.SellRequestJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SpringDataSellRequestRepository extends JpaRepository<SellRequestJpaEntity, UUID> {
    List<SellRequestJpaEntity> findByDealerId(UUID dealerId);
}
