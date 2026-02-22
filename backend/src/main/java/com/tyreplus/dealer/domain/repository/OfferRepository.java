package com.tyreplus.dealer.domain.repository;

import com.tyreplus.dealer.domain.entity.Offer;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OfferRepository {
    Offer save(Offer offer);

    Optional<Offer> findById(UUID id);

    List<Offer> findByLeadId(UUID leadId);

    List<Offer> findByDealerId(UUID dealerId);

    boolean hasDealerOffered(UUID leadId, UUID dealerId);

    void deleteById(UUID id);
}
