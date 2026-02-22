package com.tyreplus.dealer.infrastructure.persistence.repository;

import com.tyreplus.dealer.domain.entity.LeadStatus;
import com.tyreplus.dealer.infrastructure.persistence.entity.LeadJpaEntity;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA repository for LeadJpaEntity.
 */
@Repository
public interface LeadJpaRepository extends JpaRepository<LeadJpaEntity, UUID>, JpaSpecificationExecutor<LeadJpaEntity> {
        List<LeadJpaEntity> findByStatus(LeadStatus status);

        List<LeadJpaEntity> findByCustomerId(UUID customerId);

        // This method counts leads for a specific dealer created after a certain time
        long countBySelectedDealerIdAndCreatedAtAfter(UUID dealerId, LocalDateTime startOfDay);

        // Spring Data needs Pageable to handle "Top 10" or "Limit"
        List<LeadJpaEntity> findBySelectedDealerId(UUID dealerId, Pageable pageable);

        long countBySelectedDealerId(UUID dealerId);

        long countBySelectedDealerIdAndStatus(UUID dealerId, LeadStatus status);

        @Lock(LockModeType.PESSIMISTIC_WRITE)
        @Query("SELECT l FROM LeadJpaEntity l WHERE l.id = :id")
        Optional<LeadJpaEntity> findByIdWithLock(@Param("id") UUID id);

        // All available leads (no status filter)
        @Query("SELECT l FROM LeadJpaEntity l WHERE l.selectedDealerId IS NULL")
        Page<LeadJpaEntity> findAvailableLeads(Pageable pageable);

        // Available leads filtered by status
        @Query("SELECT l FROM LeadJpaEntity l WHERE l.status = :status AND l.selectedDealerId IS NULL")
        Page<LeadJpaEntity> findAvailableLeadsByStatus(
                        @Param("status") LeadStatus status,
                        Pageable pageable);

        // Returns a paginated list of leads won by a particular dealer
        Page<LeadJpaEntity> findLeadsBySelectedDealerId(UUID dealerId, Pageable pageable);
}
