package com.tyreplus.dealer.infrastructure.persistence.adapter;

import com.tyreplus.dealer.domain.entity.Offer;
import com.tyreplus.dealer.domain.repository.OfferRepository;
import com.tyreplus.dealer.infrastructure.persistence.entity.OfferJpaEntity;
import com.tyreplus.dealer.infrastructure.persistence.mapper.OfferMapper;
import com.tyreplus.dealer.infrastructure.persistence.repository.OfferJpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class OfferRepositoryAdapter implements OfferRepository {

    private final OfferJpaRepository jpaRepository;
    private final OfferMapper mapper;

    public OfferRepositoryAdapter(OfferJpaRepository jpaRepository, OfferMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Offer save(Offer offer) {
        OfferJpaEntity jpaEntity = mapper.toJpaEntity(offer);
        OfferJpaEntity saved = jpaRepository.save(jpaEntity);
        return mapper.toDomainEntity(saved);
    }

    @Override
    public Optional<Offer> findById(UUID id) {
        return jpaRepository.findById(id).map(mapper::toDomainEntity);
    }

    @Override
    public List<Offer> findByLeadId(UUID leadId) {
        return jpaRepository.findByLeadId(leadId).stream()
                .map(mapper::toDomainEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<Offer> findByDealerId(UUID dealerId) {
        return jpaRepository.findByDealerId(dealerId).stream()
                .map(mapper::toDomainEntity)
                .collect(Collectors.toList());
    }

    @Override
    public boolean hasDealerOffered(UUID leadId, UUID dealerId) {
        return jpaRepository.existsByLeadIdAndDealerId(leadId, dealerId);
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }
}
