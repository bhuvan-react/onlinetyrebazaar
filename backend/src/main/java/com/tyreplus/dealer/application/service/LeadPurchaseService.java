package com.tyreplus.dealer.application.service;

import com.tyreplus.dealer.application.dto.DealerPurchaserResponse;
import com.tyreplus.dealer.application.dto.LeadDetailsResponse;
import com.tyreplus.dealer.domain.entity.Lead;
import com.tyreplus.dealer.domain.entity.Transaction;
import com.tyreplus.dealer.domain.entity.TransactionType;
import com.tyreplus.dealer.domain.entity.Wallet;
import com.tyreplus.dealer.domain.repository.LeadRepository;
import com.tyreplus.dealer.domain.repository.TransactionRepository;
import com.tyreplus.dealer.domain.repository.WalletRepository;
import com.tyreplus.dealer.infrastructure.persistence.entity.DealerJpaEntity;
import com.tyreplus.dealer.infrastructure.persistence.entity.LeadPurchaseJpaEntity;
import com.tyreplus.dealer.infrastructure.persistence.repository.DealerJpaRepository;
import com.tyreplus.dealer.infrastructure.persistence.repository.LeadPurchaseJpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.tyreplus.dealer.domain.repository.TyreRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Application service for handling lead purchase operations.
 * Orchestrates domain entities and enforces business rules.
 */
@Service
public class LeadPurchaseService {

    public static final int LEAD_COST_CREDITS = 30;

    private final LeadRepository leadRepository;
    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final com.tyreplus.dealer.domain.repository.CustomerRepository customerRepository;
    private final TyreRepository tyreRepository;
    private final LeadPurchaseJpaRepository leadPurchaseJpaRepository;
    private final DealerJpaRepository dealerJpaRepository;

    public LeadPurchaseService(
            LeadRepository leadRepository,
            WalletRepository walletRepository,
            TransactionRepository transactionRepository,
            com.tyreplus.dealer.domain.repository.CustomerRepository customerRepository,
            TyreRepository tyreRepository,
            LeadPurchaseJpaRepository leadPurchaseJpaRepository,
            DealerJpaRepository dealerJpaRepository) {
        this.leadRepository = leadRepository;
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.customerRepository = customerRepository;
        this.tyreRepository = tyreRepository;
        this.leadPurchaseJpaRepository = leadPurchaseJpaRepository;
        this.dealerJpaRepository = dealerJpaRepository;
    }

    /**
     * Dealer buys/unlocks a lead: deducts credits from their wallet
     * and records the purchase so the lead appears in their Follow-up tab.
     * Multiple dealers can independently buy the same lead.
     */
    @Transactional
    public void buyLead(UUID leadId, UUID dealerId) {
        // 1. Idempotency — already purchased
        if (leadPurchaseJpaRepository.existsByLeadIdAndDealerId(leadId, dealerId)) {
            return; // already bought, silently succeed
        }

        // 2. Load lead
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new IllegalArgumentException("Lead not found"));

        // 3. Load & lock wallet
        Wallet wallet = walletRepository.findByDealerIdWithLock(dealerId)
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found for dealer"));

        // 4. Deduct credits (throws InsufficientFundsException if balance too low)
        Wallet.DeductionBreakdown breakdown = wallet.deduct(LEAD_COST_CREDITS);
        walletRepository.save(wallet);

        // 5. Record transaction
        Transaction transaction = new Transaction(
                wallet.getId(),
                dealerId,
                TransactionType.DEBIT,
                LEAD_COST_CREDITS,
                breakdown.purchased(),
                breakdown.bonus(),
                "Lead Purchased: " + lead.getVehicleModel(),
                null);
        transactionRepository.save(transaction);

        // 6. Insert lead_purchases row
        LeadPurchaseJpaEntity purchase = LeadPurchaseJpaEntity.builder()
                .leadId(leadId)
                .dealerId(dealerId)
                .costPaid(LEAD_COST_CREDITS)
                .build();
        leadPurchaseJpaRepository.save(purchase);
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

    /**
     * Returns the details of every dealer who has purchased/unlocked this lead.
     * Used by the customer-facing "View Dealer Offers" popup on /my-enquiries.
     */
    @Transactional(readOnly = true)
    public List<DealerPurchaserResponse> getDealerPurchasers(UUID leadId) {
        return leadPurchaseJpaRepository.findByLeadId(leadId).stream()
                .map(purchase -> {
                    DealerJpaEntity dealer = dealerJpaRepository.findById(purchase.getDealerId())
                            .orElseThrow(() -> new IllegalArgumentException(
                                    "Dealer not found: " + purchase.getDealerId()));
                    return new DealerPurchaserResponse(
                            dealer.getId(),
                            dealer.getBusinessName(),
                            dealer.getOwnerName(),
                            dealer.getPhoneNumber(),
                            dealer.getEmail(),
                            dealer.getZipCode(),
                            dealer.getCity(),
                            purchase.getPurchasedAt());
                })
                .collect(Collectors.toList());
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

        String customerName = "Customer"; // Default
        UUID customerId = lead.getCustomerId();
        if (customerId != null) {
            customerName = customerRepository.findById(customerId)
                    .map(com.tyreplus.dealer.domain.entity.Customer::getName)
                    .orElse("Customer");
        }

        java.util.List<LeadDetailsResponse.QuestionnaireItem> questionnaire = new java.util.ArrayList<>();

        if (lead.getUrgency() != null && !lead.getUrgency().isEmpty()) {
            questionnaire.add(new LeadDetailsResponse.QuestionnaireItem("urgency", "Urgency", lead.getUrgency()));
        }
        if (lead.getIssues() != null && !lead.getIssues().isEmpty()) {
            questionnaire.add(
                    new LeadDetailsResponse.QuestionnaireItem("issues", "Issues with current tyres", lead.getIssues()));
        }
        if (lead.getUsageType() != null && !lead.getUsageType().isEmpty()) {
            questionnaire.add(new LeadDetailsResponse.QuestionnaireItem("usage", "Vehicle Usage", lead.getUsageType()));
        }
        if (lead.getBudget() != null && !lead.getBudget().isEmpty()) {
            questionnaire.add(new LeadDetailsResponse.QuestionnaireItem("budget", "Budget", lead.getBudget()));
        }
        if (lead.getPreferences() != null && !lead.getPreferences().isEmpty()) {
            questionnaire.add(new LeadDetailsResponse.QuestionnaireItem("preferences", "Specific Preferences",
                    lead.getPreferences()));
        }

        LeadDetailsResponse.AssociatedTyreInfo tyreInfo = null;
        if (lead.getTyreId() != null) {
            tyreInfo = tyreRepository.findById(lead.getTyreId())
                    .map(t -> new LeadDetailsResponse.AssociatedTyreInfo(
                            t.getId(), t.getBrand(), t.getPattern(), t.getSize(), t.getType(), t.getPrice(),
                            t.getImageUrl()))
                    .orElse(null);
        }

        return new LeadDetailsResponse(
                lead.getId(),
                lead.getVehicleType(),
                lead.getTyreType(),
                lead.getTyreBrand(),
                lead.getVehicleModel(),
                lead.getVehicleYear(),
                lead.getLocationArea(),
                lead.getLocationPincode(),
                lead.getTyreSize(),
                lead.getStatus(),
                isOwner ? lead.getCustomerMobile() : null, // reveal only if owner
                lead.getSelectedDealerId(),
                lead.getCreatedAt(),
                lead.getVerifiedAt(),
                null, // purchasedAt — not available in this context
                customerName,
                lead.getServiceRequirement(),
                lead.getTyreId(),
                questionnaire,
                tyreInfo);
    }
}
