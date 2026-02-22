package com.tyreplus.dealer.infrastructure.persistence.repository;

import com.tyreplus.dealer.infrastructure.persistence.entity.OrderJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SpringDataOrderRepository extends JpaRepository<OrderJpaEntity, UUID> {
    List<OrderJpaEntity> findByDealerId(UUID dealerId);
}
