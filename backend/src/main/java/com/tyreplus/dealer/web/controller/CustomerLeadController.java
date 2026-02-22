package com.tyreplus.dealer.web.controller;

import com.tyreplus.dealer.application.dto.LeadRequest;
import com.tyreplus.dealer.application.dto.LeadDetailsResponse;
import com.tyreplus.dealer.application.dto.OfferResponse;
import com.tyreplus.dealer.application.service.LeadDiscoveryService;
import com.tyreplus.dealer.application.service.LeadPurchaseService;
import com.tyreplus.dealer.application.service.OfferService;
import com.tyreplus.dealer.infrastructure.security.CustomerDetails; // Will need to define this later
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/customer/leads")
@Tag(name = "Customer Leads", description = "Endpoints for customers to manage their tyre requirements")
@SecurityRequirement(name = "Bearer Authentication") // Depending on how customer auth is setup
@RequiredArgsConstructor
public class CustomerLeadController {

    private final LeadDiscoveryService discoveryService;
    private final OfferService offerService;
    private final LeadPurchaseService purchaseService; // To handle the wallet deduction on selection

    @Operation(summary = "Create tyre requirement", description = "Creates a new Lead.")
    @PostMapping
    public ResponseEntity<LeadDetailsResponse> createLead(
            @Valid @RequestBody LeadRequest request,
            @AuthenticationPrincipal CustomerDetails customer) {
        return ResponseEntity.ok(discoveryService.createLead(request, customer.getUsername()));
    }

    @Operation(summary = "Get Customer Leads", description = "Retrieves all leads created by the logged-in customer.")
    @GetMapping
    public ResponseEntity<List<LeadDetailsResponse>> getMyLeads(
            @AuthenticationPrincipal CustomerDetails customer) {
        return ResponseEntity.ok(discoveryService.getCustomerLeads(customer.getUsername()));
    }

    @Operation(summary = "Get Lead Offers", description = "Retrieves all dealer offers for a specific lead.")
    @GetMapping("/{leadId}/offers")
    public ResponseEntity<List<OfferResponse>> getLeadOffers(
            @PathVariable UUID leadId,
            @AuthenticationPrincipal CustomerDetails customer) {
        // TODO: Ensure security (customer can only view their own lead's offers)
        return ResponseEntity.ok(offerService.getOffersForLead(leadId));
    }

    @Operation(summary = "Select Offer", description = "Customer selects a dealer offer. Deducts from the dealer's wallet.")
    @PostMapping("/{leadId}/select-offer/{dealerId}")
    public ResponseEntity<LeadDetailsResponse> selectOffer(
            @PathVariable UUID leadId,
            @PathVariable UUID dealerId,
            @AuthenticationPrincipal CustomerDetails customer) {

        // The cost should ideally come from configuration or the offer itself.
        // Assuming a fixed cost of 100 for now, as per typical OTB models.
        int leadCost = 100;

        return ResponseEntity.ok(purchaseService.processCustomerSelection(leadId, dealerId, leadCost));
    }
}
