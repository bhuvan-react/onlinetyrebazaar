package com.tyreplus.dealer.domain.repository;

import com.tyreplus.dealer.domain.entity.Order;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepository {
    List<Order> findByDealerId(UUID dealerId);

    Optional<Order> findById(UUID id);

    Order save(Order order);
}
