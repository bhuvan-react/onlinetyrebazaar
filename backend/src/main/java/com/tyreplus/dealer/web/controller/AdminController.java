package com.tyreplus.dealer.web.controller;

import com.tyreplus.dealer.domain.entity.Dealer;
import com.tyreplus.dealer.domain.repository.DealerRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@Tag(name = "Admin", description = "Endpoints for Admin operations (Dealer Approval)")
@RequiredArgsConstructor
public class AdminController {

    private final DealerRepository dealerRepository;

    @Operation(summary = "Get Unverified Dealers", description = "Retrieves all dealers waiting for KYC verification.")
    @GetMapping("/dealers/unverified")
    public ResponseEntity<List<Dealer>> getUnverifiedDealers() {
        return ResponseEntity.ok(dealerRepository.findByIsVerifiedFalse());
    }

    @Operation(summary = "Approve Dealer", description = "Approves a dealer after manual KYC verification.")
    @PostMapping("/dealers/{id}/approve")
    public ResponseEntity<Void> approveDealer(@PathVariable UUID id) {
        Dealer dealer = dealerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Dealer not found"));

        dealer.setVerified(true);
        dealerRepository.save(dealer);

        return ResponseEntity.ok().build();
    }
}
