package com.tyreplus.dealer.web.controller;

import com.tyreplus.dealer.application.dto.DashboardResponse;
import com.tyreplus.dealer.application.dto.DealerProfileResponse;
import com.tyreplus.dealer.application.dto.UpdateDealerProfileRequest;
import com.tyreplus.dealer.application.service.DashboardService;
import com.tyreplus.dealer.application.service.DealerProfileService;
import com.tyreplus.dealer.infrastructure.security.DealerDetails; // Our new class
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Dealer operations.
 */
@RestController
@RequestMapping("/api/v1/dealer")
@Tag(name = "Dealer Profile", description = "Endpoints for managing Dealer Profile and Dashboard")
@SecurityRequirement(name = "Bearer Authentication")
public class DealerController {

    private final DealerProfileService dealerProfileService;
    private final DashboardService dashboardService;

    public DealerController(DealerProfileService dealerProfileService, DashboardService dashboardService) {
        this.dealerProfileService = dealerProfileService;
        this.dashboardService = dashboardService;
    }

    /**
     * Get dealer profile.
     * GET /api/v1/dealer/profile
     */
    @Operation(summary = "Get Profile", description = "Retrieves the profile details of the currently logged-in dealer.", responses = {
            @ApiResponse(responseCode = "200", description = "Profile details retrieved"),
            @ApiResponse(responseCode = "404", description = "Dealer not found")
    })
    @GetMapping("/profile")
    public ResponseEntity<DealerProfileResponse> getProfile(
            @AuthenticationPrincipal DealerDetails dealerDetails) {
        // No manual parsing needed! dealerDetails.getId() is already a UUID.
        return ResponseEntity.ok(dealerProfileService.getProfile(dealerDetails.getId()));
    }

    /**
     * Update dealer profile.
     * PUT /api/v1/dealer/profile
     */
    @Operation(summary = "Update Profile", description = "Updates possible fields of the dealer profile.", responses = {
            @ApiResponse(responseCode = "200", description = "Profile updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    @PutMapping("/profile")
    public ResponseEntity<DealerProfileResponse> updateProfile(
            @AuthenticationPrincipal DealerDetails dealerDetails,
            @Valid @RequestBody UpdateDealerProfileRequest request) {
        return ResponseEntity.ok(dealerProfileService.updateProfile(dealerDetails.getId(), request));
    }

    /**
     * Get dashboard data.
     * GET /api/v1/dealer/dashboard
     */
    @Operation(summary = "Get Dashboard", description = "Retrieves aggregated dashboard statistics for the dealer.", responses = {
            @ApiResponse(responseCode = "200", description = "Dashboard data retrieved")
    })
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard(
            @AuthenticationPrincipal DealerDetails dealerDetails) {
        return ResponseEntity.ok(dashboardService.getDashboard(dealerDetails.getId()));
    }
}