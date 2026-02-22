package com.tyreplus.dealer.web.controller;

import com.tyreplus.dealer.application.service.SellRequestService;
import com.tyreplus.dealer.domain.entity.SellRequest;
import com.tyreplus.dealer.infrastructure.security.CustomerDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Handles sell-tyre requests submitted by customers (not dealers).
 * Auth principal is CustomerDetails (ROLE_CUSTOMER via OTP login).
 */
@RestController
@RequestMapping("/api/v1/sell-tyres")
@Tag(name = "Sell Tyres Module", description = "Endpoints for selling old tyres")
public class SellTyreController {

    private final SellRequestService sellRequestService;

    public SellTyreController(SellRequestService sellRequestService) {
        this.sellRequestService = sellRequestService;
    }

    @PostMapping("/submit")
    @Operation(summary = "Submit Sell Request", description = "Submit a request to sell old tyres. Auth optional — submitterId is the customer UUID if logged in.", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<SellRequest> submitSellRequest(
            @AuthenticationPrincipal CustomerDetails customer,
            @RequestBody SellRequest request) {
        // customer may be null if the request is unauthenticated; pass null safely to service
        java.util.UUID submitterId = (customer != null) ? customer.getId() : null;
        return ResponseEntity.ok(sellRequestService.submitSellRequest(submitterId, request));
    }
}
