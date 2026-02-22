package com.tyreplus.dealer.application.service;

import com.tyreplus.dealer.application.dto.OfferRequest;
import com.tyreplus.dealer.application.dto.OfferResponse;
import com.tyreplus.dealer.domain.entity.Lead;
import com.tyreplus.dealer.domain.entity.LeadStatus;
import com.tyreplus.dealer.domain.entity.Offer;
import com.tyreplus.dealer.domain.repository.LeadRepository;
import com.tyreplus.dealer.domain.repository.OfferRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OfferService {

    private final OfferRepository offerRepository;
    private final LeadRepository leadRepository;

    @Transactional
    public OfferResponse submitOffer(UUID dealerId, UUID leadId, OfferRequest request) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new IllegalArgumentException("Lead not found"));

        if (lead.getStatus() != LeadStatus.VERIFIED && lead.getStatus() != LeadStatus.OFFER_RECEIVED) {
            throw new IllegalStateException("Lead is not currently accepting offers.");
        }

        if (offerRepository.hasDealerOffered(leadId, dealerId)) {
            throw new IllegalStateException("You have already submitted an offer for this lead.");
        }

        Offer offer = Offer.builder()
                .leadId(leadId)
                .dealerId(dealerId)
                .price(request.price())
                .tyreCondition(request.tyreCondition())
                .stockAvailable(request.stockAvailable())
                .imageUrls(request.imageUrls())
                .build();

        Offer savedOffer = offerRepository.save(offer);

        // Update lead status to indicate it has received at least one offer
        if (lead.getStatus() == LeadStatus.VERIFIED) {
            lead.setStatus(LeadStatus.OFFER_RECEIVED);
            leadRepository.save(lead);
        }

        return mapToResponse(savedOffer);
    }

    @Transactional(readOnly = true)
    public List<OfferResponse> getOffersForLead(UUID leadId) {
        return offerRepository.findByLeadId(leadId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private OfferResponse mapToResponse(Offer offer) {
        return new OfferResponse(
                offer.getId(),
                offer.getLeadId(),
                offer.getDealerId(),
                offer.getPrice(),
                offer.getTyreCondition(),
                offer.isStockAvailable(),
                offer.getImageUrls(),
                offer.getCreatedAt());
    }
}
