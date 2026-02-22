package com.tyreplus.dealer.infrastructure.persistence.repository;

import com.tyreplus.dealer.infrastructure.persistence.entity.QuoteRequestJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SpringDataQuoteRequestRepository extends JpaRepository<QuoteRequestJpaEntity, UUID> {
    List<QuoteRequestJpaEntity> findByDealerId(UUID dealerId);
}
