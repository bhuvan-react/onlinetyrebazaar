package com.tyreplus.dealer.application.service;

import com.tyreplus.dealer.domain.entity.Lead;
import com.tyreplus.dealer.domain.entity.LeadStatus;
import com.tyreplus.dealer.domain.repository.LeadRepository;
import com.tyreplus.dealer.infrastructure.persistence.repository.LeadPurchaseJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LeadStatusUpdateService {

    private final LeadRepository leadRepository;
    private final LeadPurchaseJpaRepository leadPurchaseJpaRepository;

    @Transactional
    public void updateStatus(UUID leadId, UUID dealerId, LeadStatus newStatus) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new IllegalArgumentException("Lead not found"));

        if (newStatus != LeadStatus.SKIPPED) {
            checkAuthority(lead, dealerId);
        }

        if (lead.getStatus() == LeadStatus.CLOSED && newStatus != LeadStatus.CLOSED) {
            throw new IllegalStateException("Closed leads are finalized.");
        }

        lead.setStatus(newStatus);
        leadRepository.save(lead);
    }

    @Transactional
    public void markAsConverted(UUID leadId, UUID dealerId) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new IllegalArgumentException("Lead not found"));

        checkAuthority(lead, dealerId);

        validateUpdatableStatus(lead);

        lead.setStatus(LeadStatus.CONVERTED);
        leadRepository.save(lead);
    }

    @Transactional
    public void markAsNotConverted(UUID leadId, UUID dealerId) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new IllegalArgumentException("Lead not found"));

        checkAuthority(lead, dealerId);

        validateUpdatableStatus(lead);

        lead.setStatus(LeadStatus.NOT_CONVERTED);
        leadRepository.save(lead);
    }

    private void checkAuthority(Lead lead, UUID dealerId) {
        if (dealerId.equals(lead.getSelectedDealerId())) {
            return;
        }

        if (leadPurchaseJpaRepository.existsByLeadIdAndDealerId(lead.getId(), dealerId)) {
            return;
        }

        throw new IllegalStateException("Unauthorized: This lead belongs to another dealer.");
    }

    private void validateUpdatableStatus(Lead lead) {
        LeadStatus status = lead.getStatus();
        // Allow updates from common active states in OTB purchase flow
        if (status == LeadStatus.CONVERTED || status == LeadStatus.NOT_CONVERTED || status == LeadStatus.CLOSED) {
            throw new IllegalStateException("Lead is already in a terminal state: " + status);
        }

        // For OTB, we specifically expect NEW, VERIFIED, FOLLOW_UP, etc.
        // We'll allow any non-terminal state for a purchased lead.
    }
}