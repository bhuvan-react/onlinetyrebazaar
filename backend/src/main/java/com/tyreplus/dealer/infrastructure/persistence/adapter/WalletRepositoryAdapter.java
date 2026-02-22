package com.tyreplus.dealer.infrastructure.persistence.adapter;

import com.tyreplus.dealer.domain.entity.Wallet;
import com.tyreplus.dealer.domain.repository.WalletRepository;
import com.tyreplus.dealer.infrastructure.persistence.entity.WalletJpaEntity;
import com.tyreplus.dealer.infrastructure.persistence.mapper.WalletMapper;
import com.tyreplus.dealer.infrastructure.persistence.repository.WalletJpaRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

/**
 * Adapter implementing WalletRepository using JPA.
 */
@Component
public class WalletRepositoryAdapter implements WalletRepository {

    private final WalletJpaRepository jpaRepository;
    private final WalletMapper mapper;

    public WalletRepositoryAdapter(WalletJpaRepository jpaRepository, WalletMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Wallet save(Wallet wallet) {
        WalletJpaEntity jpaEntity = mapper.toJpaEntity(wallet);
        WalletJpaEntity saved = jpaRepository.save(jpaEntity);
        return mapper.toDomainEntity(saved);
    }

    @Override
    public Optional<Wallet> findByDealerId(UUID dealerId) {
        return jpaRepository.findByDealerId(dealerId)
                .map(mapper::toDomainEntity);
    }

    @Override
    public Optional<Wallet> findByDealerIdWithLock(UUID dealerId) {
        return jpaRepository.findByDealerIdWithLock(dealerId)
                .map(mapper::toDomainEntity);
    }

    @Override
    public Optional<Wallet> findById(UUID id) {
        return jpaRepository.findById(id)
                .map(mapper::toDomainEntity);
    }

    @Override
    public boolean existsByDealerId(UUID dealerId) {
        return jpaRepository.existsByDealerId(dealerId);
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }
}

