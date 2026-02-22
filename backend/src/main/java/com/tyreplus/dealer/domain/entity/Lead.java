package com.tyreplus.dealer.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Domain Entity representing a Tyre Requirement (Lead).
 */
@Getter
@Setter
@Builder
@AllArgsConstructor
public class Lead {
    private UUID id;

    // Customer Details
    private UUID customerId;
    private String customerMobile; // Denormalized for quick access

    // Requirement Details
    private String vehicleType; // 2W, 3W, 4W
    private String tyreType; // New, Used
    private String tyreBrand;
    private String vehicleModel;
    private String locationArea;
    private String locationPincode;

    // Status & Flow
    private LeadStatus status;
    private UUID selectedDealerId;

    private LocalDateTime createdAt;
    private LocalDateTime verifiedAt;

    public Lead() {
        this.status = LeadStatus.NEW;
        this.createdAt = LocalDateTime.now();
    }

    public void verify() {
        if (this.status != LeadStatus.NEW) {
            throw new IllegalStateException("Only NEW leads can be verified.");
        }
        this.status = LeadStatus.VERIFIED;
        this.verifiedAt = LocalDateTime.now();
    }

    public void markOfferReceived() {
        if (this.status == LeadStatus.VERIFIED) {
            this.status = LeadStatus.OFFER_RECEIVED;
        }
    }

    public void selectDealer(UUID dealerId) {
        if (this.status != LeadStatus.OFFER_RECEIVED && this.status != LeadStatus.VERIFIED) {
            throw new IllegalStateException("Can only select dealer for verified leads or leads with offers.");
        }
        this.status = LeadStatus.DEALER_SELECTED;
        this.selectedDealerId = dealerId;
    }

    public void close() {
        if (this.status != LeadStatus.DEALER_SELECTED) {
            throw new IllegalStateException("Can only close leads that have a selected dealer.");
        }
        this.status = LeadStatus.CLOSED;
    }
}
