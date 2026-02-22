package com.tyreplus.dealer.domain.repository;

import com.tyreplus.dealer.application.dto.LeadDetailsResponse;
import com.tyreplus.dealer.domain.entity.Lead;
import com.tyreplus.dealer.domain.entity.LeadStatus;
import com.tyreplus.dealer.infrastructure.persistence.entity.LeadJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for Lead entity.
 * Part of the domain layer - no framework dependencies.
 */
public interface LeadRepository {
    Lead save(Lead lead);

    Optional<Lead> findById(UUID id);

    List<Lead> findAll();

    List<Lead> findByCustomerId(UUID customerId);

    List<Lead> findByStatus(String status);

    boolean existsById(UUID id);

    void deleteById(UUID id);

    long countBySelectedDealerIdAndCreatedAtAfter(UUID dealerId, LocalDateTime startOfDay);

    List<Lead> findRecentSelections(UUID dealerId, int limit);

    long countBySelectedDealerId(UUID dealerId);

    long countBySelectedDealerIdAndStatus(UUID dealerId, LeadStatus status);

    Optional<Lead> findByIdWithLock(UUID id);

    // Add these methods to support the Seeder
    void saveAll(List<Lead> leads);

    long count();

    void flush();

    Page<Lead> findLeadsWithFilters(LeadStatus status, UUID dealerId, Pageable pageable);

    Page<Lead> findLeadsBySelectedDealer(UUID dealerId, Pageable pageable);
}
