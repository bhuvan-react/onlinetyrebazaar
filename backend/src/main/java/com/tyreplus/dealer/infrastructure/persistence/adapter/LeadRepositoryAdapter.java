package com.tyreplus.dealer.infrastructure.persistence.adapter;

import com.tyreplus.dealer.domain.entity.Lead;
import com.tyreplus.dealer.domain.entity.LeadStatus;
import com.tyreplus.dealer.domain.repository.LeadRepository;
import com.tyreplus.dealer.infrastructure.persistence.entity.LeadJpaEntity;
import com.tyreplus.dealer.infrastructure.persistence.mapper.LeadMapper;
import com.tyreplus.dealer.infrastructure.persistence.repository.LeadJpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Adapter implementing LeadRepository using JPA.
 */
@Component
public class LeadRepositoryAdapter implements LeadRepository {

    private final LeadJpaRepository jpaRepository;
    private final LeadMapper mapper;

    public LeadRepositoryAdapter(LeadJpaRepository jpaRepository, LeadMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Lead save(Lead lead) {
        LeadJpaEntity jpaEntity = mapper.toJpaEntity(lead);
        LeadJpaEntity saved = jpaRepository.save(jpaEntity);
        return mapper.toDomainEntity(saved);
    }

    @Override
    public Optional<Lead> findById(UUID id) {
        return jpaRepository.findById(id).map(mapper::toDomainEntity);
    }

    @Override
    public List<Lead> findAll() {
        return jpaRepository.findAll().stream()
                .map(mapper::toDomainEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<Lead> findByCustomerId(UUID customerId) {
        return jpaRepository.findByCustomerId(customerId).stream()
                .map(mapper::toDomainEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<Lead> findByStatus(String status) {
        LeadStatus leadStatus = LeadStatus.valueOf(status.toUpperCase());
        return jpaRepository.findByStatus(leadStatus).stream()
                .map(mapper::toDomainEntity)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsById(UUID id) {
        return jpaRepository.existsById(id);
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public long countBySelectedDealerIdAndCreatedAtAfter(UUID dealerId, LocalDateTime startOfDay) {
        return jpaRepository.countBySelectedDealerIdAndCreatedAtAfter(dealerId, startOfDay);
    }

    @Override
    public List<Lead> findRecentSelections(UUID dealerId, int limit) {
        // Uses PageRequest to handle the LIMIT at the SQL level
        Pageable pageable = PageRequest.of(0, limit, org.springframework.data.domain.Sort.by("createdAt").descending());
        return jpaRepository.findBySelectedDealerId(dealerId, pageable)
                .stream()
                .map(mapper::toDomainEntity)
                .collect(Collectors.toList());
    }

    @Override
    public long countBySelectedDealerId(UUID dealerId) {
        return jpaRepository.countBySelectedDealerId(dealerId);
    }

    @Override
    public long countBySelectedDealerIdAndStatus(UUID dealerId, LeadStatus status) {
        return jpaRepository.countBySelectedDealerIdAndStatus(dealerId, status);
    }

    @Override
    public Optional<Lead> findByIdWithLock(UUID id) {
        return jpaRepository.findByIdWithLock(id)
                .map(mapper::toDomainEntity);
    }

    @Override
    public void saveAll(List<Lead> leads) {
        List<LeadJpaEntity> entities = leads.stream()
                .map(mapper::toJpaEntity)
                .toList();
        jpaRepository.saveAll(entities);
    }

    @Override
    public long count() {
        return jpaRepository.count();
    }

    @Override
    public void flush() {
        jpaRepository.flush();
    }

    @Override
    public Page<Lead> findLeadsWithFilters(LeadStatus status, UUID dealerId, Pageable pageable) {
        if (status == null) {
            return jpaRepository.findAvailableLeads(pageable).map(mapper::toDomainEntity);
        }
        return jpaRepository.findAvailableLeadsByStatus(status, pageable).map(mapper::toDomainEntity);
    }

    @Override
    public Page<Lead> findLeadsBySelectedDealer(UUID dealerId, Pageable pageable) {
        return jpaRepository.findLeadsBySelectedDealerId(dealerId, pageable).map(mapper::toDomainEntity);
    }
}
