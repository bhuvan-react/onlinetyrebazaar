package com.tyreplus.dealer.infrastructure.persistence.mapper;

import com.tyreplus.dealer.domain.entity.Wallet;
import com.tyreplus.dealer.infrastructure.persistence.entity.WalletJpaEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper between domain Wallet entity and JPA entity.
 */
@Component
public class WalletMapper {

    public WalletJpaEntity toJpaEntity(Wallet wallet) {
        return WalletJpaEntity.builder()
                .id(wallet.getId())
                .dealerId(wallet.getDealerId())
                .purchasedCredits(wallet.getPurchasedCredits())
                .bonusCredits(wallet.getBonusCredits())
                .version(wallet.getVersion())
                .build();
    }

    public Wallet toDomainEntity(WalletJpaEntity jpaEntity) {
        return Wallet.builder()
                .id(jpaEntity.getId())
                .dealerId(jpaEntity.getDealerId())
                .purchasedCredits(jpaEntity.getPurchasedCredits())
                .bonusCredits(jpaEntity.getBonusCredits())
                .version(jpaEntity.getVersion())
                .build();
    }
}

