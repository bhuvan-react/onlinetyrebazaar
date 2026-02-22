package com.tyreplus.dealer.application.service;

import com.tyreplus.dealer.domain.entity.Order;
import com.tyreplus.dealer.domain.entity.QuoteRequest;
import com.tyreplus.dealer.domain.repository.OrderRepository;
import com.tyreplus.dealer.domain.repository.QuoteRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final QuoteRequestRepository quoteRequestRepository;

    public OrderService(OrderRepository orderRepository, QuoteRequestRepository quoteRequestRepository) {
        this.orderRepository = orderRepository;
        this.quoteRequestRepository = quoteRequestRepository;
    }

    public List<Order> getOrders(UUID dealerId) {
        return orderRepository.findByDealerId(dealerId);
    }

    public Order getOrderDetails(UUID orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
    }

    @Transactional
    public Order placeOrder(UUID dealerId, Order order) {
        order.setDealerId(dealerId);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("Pending");
        order.setOrderNumber(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        return orderRepository.save(order);
    }

    public List<QuoteRequest> getQuoteRequests(UUID dealerId) {
        return quoteRequestRepository.findByDealerId(dealerId);
    }

    @Transactional
    public QuoteRequest createQuoteRequest(UUID dealerId, QuoteRequest request) {
        request.setDealerId(dealerId);
        request.setRequestDate(LocalDateTime.now());
        request.setStatus("Open");
        request.setRequestNumber("Q-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        return quoteRequestRepository.save(request);
    }
}
