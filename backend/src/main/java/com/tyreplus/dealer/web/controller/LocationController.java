package com.tyreplus.dealer.web.controller;

import com.tyreplus.dealer.application.service.LocationService;
import com.tyreplus.dealer.domain.entity.ServiceableLocation;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/locations")
@Tag(name = "Location Module", description = "Endpoints for Serviceability Checks")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping("/check")
    @Operation(summary = "Check Serviceability", description = "Check if a pincode is serviceable")
    public ResponseEntity<Map<String, Object>> checkServiceability(@RequestParam String pincode) {
        return locationService.checkServiceability(pincode)
                .map(loc -> {
                    Map<String, Object> response = new java.util.HashMap<>();
                    response.put("serviceable", true);
                    response.put("city", loc.getCity());
                    response.put("state", loc.getState());
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    Map<String, Object> response = new java.util.HashMap<>();
                    response.put("serviceable", false);
                    response.put("message", "Location not serviceable");
                    return ResponseEntity.ok(response);
                });
    }
}
