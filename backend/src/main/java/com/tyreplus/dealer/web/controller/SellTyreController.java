package com.tyreplus.dealer.web.controller;

import com.tyreplus.dealer.application.service.SellRequestService;
import com.tyreplus.dealer.domain.entity.SellRequest;
import com.tyreplus.dealer.infrastructure.security.DealerDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/sell-tyres")
@Tag(name = "Sell Tyres Module", description = "Endpoints for selling old tyres")
public class SellTyreController {

    private final SellRequestService sellRequestService;

    public SellTyreController(SellRequestService sellRequestService) {
        this.sellRequestService = sellRequestService;
    }

    @PostMapping("/submit")
    @Operation(summary = "Submit Sell Request", description = "Submit a request to sell old tyres", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<SellRequest> submitSellRequest(@AuthenticationPrincipal DealerDetails dealer,
            @RequestBody SellRequest request) {
        return ResponseEntity.ok(sellRequestService.submitSellRequest(dealer.getId(), request));
    }
}
