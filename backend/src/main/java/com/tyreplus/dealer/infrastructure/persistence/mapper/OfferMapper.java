package com.tyreplus.dealer.infrastructure.persistence.mapper;

import com.tyreplus.dealer.domain.entity.Offer;
import com.tyreplus.dealer.infrastructure.persistence.entity.OfferJpaEntity;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
public class OfferMapper {

    public Offer toDomainEntity(OfferJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }

        return Offer.builder()
                .id(jpaEntity.getId())
                .leadId(jpaEntity.getLeadId())
                .dealerId(jpaEntity.getDealerId())
                .price(jpaEntity.getPrice())
                .tyreCondition(jpaEntity.getTyreCondition())
                .stockAvailable(jpaEntity.isStockAvailable())
                .imageUrls(jpaEntity.getImageUrls() != null ? new ArrayList<>(jpaEntity.getImageUrls())
                        : new ArrayList<>())
                .createdAt(jpaEntity.getCreatedAt())
                .build();
    }

    public OfferJpaEntity toJpaEntity(Offer domainEntity) {
        if (domainEntity == null) {
            return null;
        }

        return OfferJpaEntity.builder()
                .id(domainEntity.getId())
                .leadId(domainEntity.getLeadId())
                .dealerId(domainEntity.getDealerId())
                .price(domainEntity.getPrice())
                .tyreCondition(domainEntity.getTyreCondition())
                .stockAvailable(domainEntity.isStockAvailable())
                .imageUrls(domainEntity.getImageUrls() != null ? new ArrayList<>(domainEntity.getImageUrls())
                        : new ArrayList<>())
                .createdAt(domainEntity.getCreatedAt())
                .build();
    }
}
