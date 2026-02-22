package com.tyreplus.dealer.infrastructure.persistence.mapper;

import com.tyreplus.dealer.domain.entity.Transaction;
import com.tyreplus.dealer.infrastructure.persistence.entity.TransactionJpaEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper between domain Transaction entity and JPA entity.
 */
@Component
public class TransactionMapper {

    public TransactionJpaEntity toJpaEntity(Transaction transaction) {
        if (transaction == null) {
            return null;
        }

        return TransactionJpaEntity.builder()
                .id(transaction.getId())
                .walletId(transaction.getWalletId())
                .dealerId(transaction.getDealerId())
                .type(transaction.getType())
                .credits(transaction.getCredits())
                .purchasedCredits(transaction.getPurchasedCredits()) // Map new field
                .bonusCredits(transaction.getBonusCredits()) // Map new field
                .description(transaction.getDescription())
                .paymentId(transaction.getPaymentId()) // Map new field
                .createdAt(transaction.getTimestamp())
                .build();
    }

    public Transaction toDomainEntity(TransactionJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }

        return Transaction.builder()
                .id(jpaEntity.getId())
                .walletId(jpaEntity.getWalletId())
                .dealerId(jpaEntity.getDealerId())
                .type(jpaEntity.getType())
                .credits(jpaEntity.getCredits())
                .purchasedCredits(jpaEntity.getPurchasedCredits())
                .bonusCredits(jpaEntity.getBonusCredits())
                .description(jpaEntity.getDescription())
                .paymentId(jpaEntity.getPaymentId())
                .timestamp(jpaEntity.getCreatedAt())
                .build();
    }
}
