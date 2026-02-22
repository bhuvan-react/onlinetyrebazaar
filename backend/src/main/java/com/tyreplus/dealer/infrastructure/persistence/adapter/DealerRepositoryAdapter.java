package com.tyreplus.dealer.infrastructure.persistence.adapter;

import com.tyreplus.dealer.domain.entity.Dealer;
import com.tyreplus.dealer.domain.repository.DealerRepository;
import com.tyreplus.dealer.infrastructure.persistence.entity.DealerJpaEntity;
import com.tyreplus.dealer.infrastructure.persistence.mapper.DealerMapper;
import com.tyreplus.dealer.infrastructure.persistence.repository.DealerJpaRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

/**
 * Adapter implementing DealerRepository using JPA.
 */
@Component
public class DealerRepositoryAdapter implements DealerRepository {

    private final DealerJpaRepository jpaRepository;
    private final DealerMapper mapper;

    public DealerRepositoryAdapter(DealerJpaRepository jpaRepository, DealerMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Dealer save(Dealer dealer) {
        DealerJpaEntity jpaEntity = mapper.toJpaEntity(dealer);
        DealerJpaEntity saved = jpaRepository.save(jpaEntity);
        return mapper.toDomainEntity(saved);
    }

    @Override
    public Optional<Dealer> findById(UUID id) {
        return jpaRepository.findById(id)
                .map(mapper::toDomainEntity);
    }

    @Override
    public Optional<Dealer> findByMobile(String mobile) {
        return jpaRepository.findByPhoneNumber(mobile)
                .map(mapper::toDomainEntity);
    }

    @Override
    public Optional<Dealer> findByEmail(String email) {
        return jpaRepository.findByEmail(email)
                .map(mapper::toDomainEntity);
    }

    @Override
    public Optional<Dealer> findByPhoneNumberOrEmail(String identifier) {
        return jpaRepository.findByPhoneNumberOrEmail(identifier, identifier)
                .map(mapper::toDomainEntity);
    }

    @Override
    public List<Dealer> findByIsVerifiedFalse() {
        return jpaRepository.findByIsVerifiedFalse().stream()
                .map(mapper::toDomainEntity)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public boolean existsById(UUID id) {
        return jpaRepository.existsById(id);
    }

    @Override
    public boolean existsByMobile(String mobile) {
        return jpaRepository.existsByPhoneNumber(mobile);
    }

    @Override
    public boolean existsByEmail(String email) {
        return jpaRepository.existsByEmail(email);
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }
}
