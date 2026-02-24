package com.tyreplus.dealer.application.service;

import com.tyreplus.dealer.domain.entity.Lead;
import com.tyreplus.dealer.domain.entity.LeadStatus;
import com.tyreplus.dealer.domain.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LeadStatusUpdateService {

    private final LeadRepository leadRepository;

    @Transactional
    public void updateStatus(UUID leadId, UUID dealerId, LeadStatus newStatus) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new IllegalArgumentException("Lead not found"));

        // Security: Prevent Dealer A from updating Dealer B's leads
        if (!dealerId.equals(lead.getSelectedDealerId())) {
            throw new IllegalStateException("Unauthorized: This lead belongs to another dealer.");
        }

        // Logic: Once a lead is CLOSED, you probably shouldn't allow changing it back
        // to NEW
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

        if (!dealerId.equals(lead.getSelectedDealerId())) {
            throw new IllegalStateException("Unauthorized: This lead belongs to another dealer.");
        }

        // Typically, only leads that are DEALER_SELECTED or FOLLOW_UP can be converted
        if (lead.getStatus() != LeadStatus.DEALER_SELECTED && lead.getStatus() != LeadStatus.FOLLOW_UP) {
            throw new IllegalStateException("Cannot convert lead in current status: " + lead.getStatus());
        }

        lead.setStatus(LeadStatus.CONVERTED);
        leadRepository.save(lead);
    }
}