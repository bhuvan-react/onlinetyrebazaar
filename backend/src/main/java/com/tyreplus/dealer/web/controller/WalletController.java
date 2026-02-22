package com.tyreplus.dealer.web.controller;

import com.tyreplus.dealer.application.dto.*;
import com.tyreplus.dealer.application.service.WalletService;
import com.tyreplus.dealer.infrastructure.security.DealerDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST Controller for Wallet operations.
 */
@RestController
@RequestMapping("/api/v1/dealer")
@Tag(name = "Wallet & Payments", description = "Endpoints for Wallet Management, Recharges, and Payment Verification")
@SecurityRequirement(name = "Bearer Authentication")
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    /**
     * Get wallet details.
     * GET /api/v1/dealer/wallet
     */
    @Operation(summary = "Get Wallet Balance", description = "Retrieves the current wallet balance (Purchased + Bonus) and transaction history.", responses = {
            @ApiResponse(responseCode = "200", description = "Wallet details retrieved"),
            @ApiResponse(responseCode = "404", description = "Wallet not found")
    })
    @GetMapping("/wallet")
    public ResponseEntity<WalletResponse> getWallet(@AuthenticationPrincipal DealerDetails dealerDetails) {
        WalletResponse response = walletService.getWalletDetails(dealerDetails.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * Get available packages.
     * GET /api/v1/dealer/packages
     */
    @Operation(summary = "List Packages", description = "Retrieves all active recharge packages available for purchase.", responses = {
            @ApiResponse(responseCode = "200", description = "Packages listed"),
    })
    @GetMapping("/packages")
    public ResponseEntity<List<PackageResponse>> getPackages() {
        List<PackageResponse> packages = walletService.getPackages();
        return ResponseEntity.ok(packages);
    }

    /**
     * Initiate Payment
     * POST /api/v1/dealer/recharge/initiate
     */
    @Operation(summary = "Initiate Recharge", description = "Creates a local Razorpay order for the selected package and returns the Order ID.", responses = {
            @ApiResponse(responseCode = "200", description = "Order created"),
            @ApiResponse(responseCode = "400", description = "Invalid Package ID")
    })
    @PostMapping("/recharge/initiate")
    public ResponseEntity<PaymentOrderResponse> initiate(@AuthenticationPrincipal DealerDetails dealer,
            @Valid @RequestBody RechargeRequest request) {
        return ResponseEntity.ok(walletService.initiateRecharge(dealer.getId(), UUID.fromString(request.packageId())));
    }

    /**
     * verify payment.
     * POST /api/v1/dealer/recharge/verify
     */
    @Operation(summary = "Verify Payment", description = "Verifies the Razorpay payment signature and credits the wallet if successful.", responses = {
            @ApiResponse(responseCode = "200", description = "Recharge successful"),
            @ApiResponse(responseCode = "400", description = "Verification failed")
    })
    @PostMapping("/recharge/verify")
    public ResponseEntity<WalletResponse> verify(@AuthenticationPrincipal DealerDetails dealer,
            @RequestBody PaymentVerificationRequest request) {
        return ResponseEntity.ok(walletService.completeRecharge(dealer.getId(), request));
    }

    /**
     * Recharge wallet (TEST).
     * POST /api/v1/dealer/wallet/testRecharge
     */
    @Operation(summary = "Test Recharge (Dev Only)", description = "Simulates a recharge without actual payment. Only for testing purposes.", responses = {
            @ApiResponse(responseCode = "200", description = "Recharge successful"),
    })
    @PostMapping("/wallet/testRecharge")
    public ResponseEntity<WalletResponse> testRecharge(
            @AuthenticationPrincipal DealerDetails dealerDetails,
            @Valid @RequestBody RechargeRequest request) {
        WalletResponse response = walletService.testRecharge(dealerDetails.getId(), request);
        return ResponseEntity.ok(response);
    }
}
