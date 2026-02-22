package com.tyreplus.dealer.infrastructure.persistence.adapter;

import com.tyreplus.dealer.domain.entity.Transaction;
import com.tyreplus.dealer.domain.repository.TransactionRepository;
import com.tyreplus.dealer.infrastructure.persistence.entity.TransactionJpaEntity;
import com.tyreplus.dealer.infrastructure.persistence.mapper.TransactionMapper;
import com.tyreplus.dealer.infrastructure.persistence.repository.TransactionJpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Adapter implementing TransactionRepository using JPA.
 */
@Component
public class TransactionRepositoryAdapter implements TransactionRepository {

    private final TransactionJpaRepository jpaRepository;
    private final TransactionMapper mapper;

    public TransactionRepositoryAdapter(TransactionJpaRepository jpaRepository, TransactionMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Transaction save(Transaction transaction) {
        TransactionJpaEntity jpaEntity = mapper.toJpaEntity(transaction);
        TransactionJpaEntity saved = jpaRepository.save(jpaEntity);
        return mapper.toDomainEntity(saved);
    }

    @Override
    public List<Transaction> findByDealerId(UUID dealerId) {
        return jpaRepository.findByDealerIdOrderByCreatedAtDesc(dealerId).stream()
                .map(mapper::toDomainEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<Transaction> findByWalletId(UUID walletId) {
        return jpaRepository.findByWalletIdOrderByCreatedAtDesc(walletId).stream()
                .map(mapper::toDomainEntity)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsByPaymentId(String paymentId) {
        return jpaRepository.existsByPaymentId(paymentId);
    }
}
