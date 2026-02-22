package com.tyreplus.dealer.web.controller;

import com.tyreplus.dealer.application.service.OrderService;
import com.tyreplus.dealer.domain.entity.Order;
import com.tyreplus.dealer.domain.entity.QuoteRequest;
import com.tyreplus.dealer.infrastructure.security.DealerDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
@Tag(name = "Order & Requests Module", description = "Endpoints for Orders and Quote Requests")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // --- Orders ---

    @GetMapping
    @Operation(summary = "Get My Orders", description = "Get list of orders placed by the dealer", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<List<Order>> getOrders(@AuthenticationPrincipal DealerDetails dealer) {
        return ResponseEntity.ok(orderService.getOrders(dealer.getId()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Order Details", description = "Get details of a specific order", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<Order> getOrderDetails(@PathVariable UUID id) {
        return ResponseEntity.ok(orderService.getOrderDetails(id));
    }

    @PostMapping
    @Operation(summary = "Place Order", description = "Create a new order", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<Order> placeOrder(@AuthenticationPrincipal DealerDetails dealer, @RequestBody Order order) {
        return ResponseEntity.ok(orderService.placeOrder(dealer.getId(), order));
    }

    // --- Quote Requests ---

    @GetMapping("/requests")
    @Operation(summary = "Get Quote Requests", description = "Get list of quote requests", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<List<QuoteRequest>> getQuoteRequests(@AuthenticationPrincipal DealerDetails dealer) {
        return ResponseEntity.ok(orderService.getQuoteRequests(dealer.getId()));
    }

    @PostMapping("/requests")
    @Operation(summary = "Create Quote Request", description = "Submit a new quote request", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<QuoteRequest> createQuoteRequest(@AuthenticationPrincipal DealerDetails dealer,
            @RequestBody QuoteRequest request) {
        return ResponseEntity.ok(orderService.createQuoteRequest(dealer.getId(), request));
    }
}
