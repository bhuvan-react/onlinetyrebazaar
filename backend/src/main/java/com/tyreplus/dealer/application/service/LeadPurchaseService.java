package com.tyreplus.dealer.application.service;

import com.tyreplus.dealer.application.dto.LeadDetailsResponse;
import com.tyreplus.dealer.application.exception.InsufficientFundsException;
import com.tyreplus.dealer.domain.entity.Lead;
import com.tyreplus.dealer.domain.entity.Transaction;
import com.tyreplus.dealer.domain.entity.TransactionType;
import com.tyreplus.dealer.domain.entity.Wallet;
import com.tyreplus.dealer.domain.repository.LeadRepository;
import com.tyreplus.dealer.domain.repository.TransactionRepository;
import com.tyreplus.dealer.domain.repository.WalletRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Application service for handling lead purchase operations.
 * Orchestrates domain entities and enforces business rules.
 */
@Service
public class LeadPurchaseService {

    private final LeadRepository leadRepository;
    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;

    public LeadPurchaseService(
            LeadRepository leadRepository,
            WalletRepository walletRepository,
            TransactionRepository transactionRepository) {
        this.leadRepository = leadRepository;
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
    }

    /**
     * Deducts wallet balance when a customer selects this dealer's offer.
     * This operation is atomic and transactional.
     */
    @Transactional
    public LeadDetailsResponse processCustomerSelection(UUID leadId, UUID dealerId, int leadCost) {
        // 1. Lock Lead (Prevents race conditions)
        Lead lead = leadRepository.findByIdWithLock(leadId)
                .orElseThrow(() -> new IllegalArgumentException("Lead not found"));

        // 2. Idempotency Check
        if (dealerId.equals(lead.getSelectedDealerId())) {
            return mapToResponse(lead, dealerId);
        }

        // 3. Availability Check (must be OFFER_RECEIVED status, not already
        // DEALER_SELECTED)
        if (lead.getStatus() == com.tyreplus.dealer.domain.entity.LeadStatus.DEALER_SELECTED
                || lead.getStatus() == com.tyreplus.dealer.domain.entity.LeadStatus.CLOSED) {
            throw new IllegalStateException("Lead has already been awarded to a dealer.");
        }

        // 4. Lock Wallet
        Wallet wallet = walletRepository.findByDealerIdWithLock(dealerId)
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found"));

        // 5. Execute Logic (Uses the new Bonus-first deduction)
        Wallet.DeductionBreakdown breakdown = wallet.deduct(leadCost); // In OTB, Cost might be dynamic or fixed

        // Update Lead State
        lead.selectDealer(dealerId);

        // 6. Persistence
        walletRepository.save(wallet);
        leadRepository.save(lead);

        // 7. Detailed Transaction Recording
        recordDetailedTransaction(wallet, dealerId, lead, leadCost, breakdown);

        return mapToResponse(lead, dealerId);
    }

    private void recordDetailedTransaction(Wallet wallet, UUID dealerId, Lead lead, int leadCost,
            Wallet.DeductionBreakdown breakdown) {
        // Create transaction record
        Transaction transaction = new Transaction(
                wallet.getId(),
                dealerId,
                TransactionType.DEBIT,
                leadCost,
                breakdown.purchased(),
                breakdown.bonus(),
                "Lead Won: " + lead.getVehicleModel(), // Hide customer name in transaction history if anonymous
                null); // paymentId is null for internal debits
        transactionRepository.save(transaction);
    }

    private LeadDetailsResponse mapToResponse(Lead lead, UUID currentDealerId) {
        boolean isOwner = lead.getSelectedDealerId() != null && lead.getSelectedDealerId().equals(currentDealerId);

        return new LeadDetailsResponse(
                lead.getId(),
                lead.getVehicleType(),
                lead.getTyreType(),
                lead.getTyreBrand(),
                lead.getVehicleModel(),
                lead.getLocationArea(),
                lead.getLocationPincode(),
                lead.getStatus(),
                isOwner ? lead.getCustomerMobile() : null, // reveal only if owner
                lead.getSelectedDealerId(),
                lead.getCreatedAt(),
                lead.getVerifiedAt());
    }
}
