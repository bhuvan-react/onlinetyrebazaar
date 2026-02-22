package com.tyreplus.dealer.web.controller;

import com.tyreplus.dealer.application.dto.LeadDetailsResponse;
import com.tyreplus.dealer.application.service.LeadDiscoveryService;
import com.tyreplus.dealer.application.service.LeadPurchaseService;
import com.tyreplus.dealer.application.service.LeadStatusUpdateService;
import com.tyreplus.dealer.domain.entity.LeadStatus;
import com.tyreplus.dealer.application.dto.OfferRequest;
import com.tyreplus.dealer.application.dto.OfferResponse;
import com.tyreplus.dealer.application.service.OfferService;
import jakarta.validation.Valid;
import com.tyreplus.dealer.infrastructure.security.DealerDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/leads")
@Tag(name = "Lead Management", description = "Endpoints for discovering, purchasing, and managing leads")
@SecurityRequirement(name = "Bearer Authentication")
public class LeadController {

    private final LeadPurchaseService purchaseService;
    private final LeadStatusUpdateService statusService;
    private final LeadDiscoveryService discoveryService;
    private final OfferService offerService;

    public LeadController(LeadPurchaseService purchaseService, LeadStatusUpdateService statusService,
            LeadDiscoveryService discoveryService, OfferService offerService) {
        this.purchaseService = purchaseService;
        this.statusService = statusService;
        this.discoveryService = discoveryService;
        this.offerService = offerService;
    }

    @Operation(summary = "Get Leads", description = "Retrieves an anonymous list of leads the dealer can bid on.")
    @GetMapping
    public ResponseEntity<Page<LeadDetailsResponse>> getLeads(
            @AuthenticationPrincipal DealerDetails dealer,
            @RequestParam(defaultValue = "All") String filter,
            @RequestParam(defaultValue = "date_desc") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(discoveryService.getLeads(dealer.getId(), filter, sort, page, size));
    }

    @Operation(summary = "Get Unlocked Leads", description = "Retrieves leads where the dealer has been selected and paid.")
    @GetMapping("/unlocked")
    public ResponseEntity<Page<LeadDetailsResponse>> getUnlockedLeads(
            @AuthenticationPrincipal DealerDetails dealer,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(discoveryService.getUnlockedLeads(dealer.getId(), page, size));
    }

    @Operation(summary = "Get Lead Details", description = "Retrieves detailed information about a specific lead. Contact details will be unlocked if the dealer is selected.")
    @GetMapping("/{leadId}")
    public ResponseEntity<LeadDetailsResponse> getDetails(@PathVariable UUID leadId,
            @AuthenticationPrincipal DealerDetails dealer) {
        return ResponseEntity.ok(discoveryService.getLeadById(leadId, dealer.getId()));
    }

    @Operation(summary = "Submit Offer", description = "Submits a bid for a specific lead.")
    @PostMapping("/{leadId}/offer")
    public ResponseEntity<OfferResponse> submitOffer(
            @PathVariable UUID leadId,
            @Valid @RequestBody OfferRequest request,
            @AuthenticationPrincipal DealerDetails dealer) {
        return ResponseEntity.ok(offerService.submitOffer(dealer.getId(), leadId, request));
    }

    @Operation(summary = "Update Lead Status", description = "Updates the status of a lead.")
    @PutMapping("/{leadId}/status")
    public ResponseEntity<Void> updateStatus(@PathVariable UUID leadId, @RequestParam LeadStatus status,
            @AuthenticationPrincipal DealerDetails dealer) {
        statusService.updateStatus(leadId, dealer.getId(), status);
        return ResponseEntity.ok().build();
    }
}
