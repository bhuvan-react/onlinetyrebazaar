package com.tyreplus.dealer.web.controller;

import com.tyreplus.dealer.application.service.FilterService;
import com.tyreplus.dealer.domain.entity.FilterConfig;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/filters")
@Tag(name = "Filters Module", description = "Endpoints for dynamic frontend filters")
public class FilterController {

    private final FilterService filterService;

    public FilterController(FilterService filterService) {
        this.filterService = filterService;
    }

    @GetMapping("/price-ranges")
    @Operation(summary = "Get Price Ranges", description = "Gets available price ranges for filtering")
    public ResponseEntity<List<FilterConfig>> getPriceRanges() {
        return ResponseEntity.ok(filterService.getPriceRanges());
    }

    @GetMapping("/ratings")
    @Operation(summary = "Get Ratings", description = "Gets available rating filters")
    public ResponseEntity<List<FilterConfig>> getRatings() {
        return ResponseEntity.ok(filterService.getRatings());
    }

    @GetMapping("/brands")
    @Operation(summary = "Get Brands", description = "Gets available tyre brands")
    public ResponseEntity<Map<String, List<String>>> getBrands() {
        return ResponseEntity.ok(Map.of("brands", filterService.getBrands()));
    }

    @GetMapping("/sizes")
    @Operation(summary = "Get Sizes", description = "Gets all available tyre sizes")
    public ResponseEntity<Map<String, List<String>>> getSizes() {
        return ResponseEntity.ok(Map.of("sizes", filterService.getSizes()));
    }
}
