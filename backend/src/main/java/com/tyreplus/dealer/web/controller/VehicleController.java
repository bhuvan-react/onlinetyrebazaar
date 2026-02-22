package com.tyreplus.dealer.web.controller;

import com.tyreplus.dealer.application.service.VehicleService;
import com.tyreplus.dealer.domain.entity.UserVehicle;
import com.tyreplus.dealer.infrastructure.security.DealerDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/vehicles")
@Tag(name = "Vehicle Module", description = "Endpoints for Vehicle Master Data and User Garage")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    // --- Master Data ---

    @GetMapping("/makes")
    @Operation(summary = "Get Makes", description = "Get list of vehicle makes by type (2W/4W)")
    public ResponseEntity<Map<String, List<String>>> getMakes(@RequestParam String type) {
        return ResponseEntity.ok(Map.of("makes", vehicleService.getMakes(type)));
    }

    @GetMapping("/models")
    @Operation(summary = "Get Models", description = "Get list of vehicle models by make")
    public ResponseEntity<Map<String, List<String>>> getModels(@RequestParam String type, @RequestParam String make) {
        return ResponseEntity.ok(Map.of("models", vehicleService.getModels(type, make)));
    }

    @GetMapping("/variants")
    @Operation(summary = "Get Variants", description = "Get list of variants by model")
    public ResponseEntity<Map<String, List<String>>> getVariants(@RequestParam String type, @RequestParam String make,
            @RequestParam String model) {
        return ResponseEntity.ok(Map.of("variants", vehicleService.getVariants(type, make, model)));
    }

    @GetMapping("/tyre-sizes")
    @Operation(summary = "Get Tyre Sizes", description = "Get compatible tyre sizes for a variant")
    public ResponseEntity<Map<String, List<String>>> getTyreSizes(@RequestParam String make, @RequestParam String model,
            @RequestParam String variant) {
        return ResponseEntity.ok(Map.of("sizes", vehicleService.getTyreSizes(make, model, variant)));
    }

    // --- Garage ---

    @GetMapping
    @Operation(summary = "Get My Vehicles", description = "Get list of vehicles added to user's garage", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<List<UserVehicle>> getUserVehicles(@AuthenticationPrincipal DealerDetails dealer) {
        return ResponseEntity.ok(vehicleService.getUserVehicles(dealer.getId()));
    }

    @PostMapping
    @Operation(summary = "Add Vehicle", description = "Add a vehicle to garage", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<UserVehicle> addVehicle(@AuthenticationPrincipal DealerDetails dealer,
            @RequestBody UserVehicle vehicle) {
        return ResponseEntity.ok(vehicleService.addUserVehicle(dealer.getId(), vehicle));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Vehicle", description = "Remove a vehicle from garage", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<Void> deleteVehicle(@AuthenticationPrincipal DealerDetails dealer, @PathVariable UUID id) {
        vehicleService.deleteUserVehicle(dealer.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
