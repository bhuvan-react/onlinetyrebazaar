package com.tyreplus.dealer.web.controller;

import com.tyreplus.dealer.application.service.TyreService;
import com.tyreplus.dealer.domain.entity.Tyre;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tyres")
@Tag(name = "Tyre Module", description = "Endpoints for Tyre Search and Details")
public class TyreController {

    private final TyreService tyreService;

    public TyreController(TyreService tyreService) {
        this.tyreService = tyreService;
    }

    @GetMapping
    @Operation(summary = "Search Tyres", description = "Search tyres by brand, size, or pattern")
    public ResponseEntity<List<Tyre>> searchTyres(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) String pattern) {
        return ResponseEntity.ok(tyreService.searchTyres(brand, size, pattern));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Tyre Details", description = "Get full details of a specific tyre")
    public ResponseEntity<Tyre> getTyreDetails(@PathVariable UUID id) {
        return tyreService.getTyreDetails(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/brands")
    @Operation(summary = "Get Brands", description = "Get list of available tyre brands")
    public ResponseEntity<Map<String, List<String>>> getBrands() {
        return ResponseEntity.ok(Map.of("brands", tyreService.getAllBrands()));
    }

    @GetMapping("/sizes")
    @Operation(summary = "Get Sizes", description = "Get list of available tyre sizes for a brand")
    public ResponseEntity<Map<String, List<String>>> getSizes(@RequestParam String brand) {
        return ResponseEntity.ok(Map.of("sizes", tyreService.getSizesByBrand(brand)));
    }
}
