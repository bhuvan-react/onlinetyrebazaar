package com.tyreplus.dealer.infrastructure.persistence.adapter;

import com.tyreplus.dealer.domain.entity.Order;
import com.tyreplus.dealer.domain.entity.OrderItem;
import com.tyreplus.dealer.domain.repository.OrderRepository;
import com.tyreplus.dealer.infrastructure.persistence.entity.OrderItemJpaEntity;
import com.tyreplus.dealer.infrastructure.persistence.entity.OrderJpaEntity;
import com.tyreplus.dealer.infrastructure.persistence.repository.SpringDataOrderRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class OrderRepositoryAdapter implements OrderRepository {

    private final SpringDataOrderRepository repository;

    public OrderRepositoryAdapter(SpringDataOrderRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Order> findByDealerId(UUID dealerId) {
        return repository.findByDealerId(dealerId).stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public Optional<Order> findById(UUID id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public Order save(Order order) {
        OrderJpaEntity entity = toJpa(order);
        // Ensure bidirectional relationship for cascade
        if (entity.getItems() != null) {
            entity.getItems().forEach(item -> item.setOrder(entity));
        }
        OrderJpaEntity saved = repository.save(entity);
        return toDomain(saved);
    }

    private Order toDomain(OrderJpaEntity entity) {
        return Order.builder()
                .id(entity.getId())
                .dealerId(entity.getDealerId())
                .orderNumber(entity.getOrderNumber())
                .orderDate(entity.getOrderDate())
                .status(entity.getStatus())
                .totalAmount(entity.getTotalAmount())
                .items(entity.getItems().stream()
                        .map(this::toDomainItem)
                        .collect(Collectors.toList()))
                .build();
    }

    private OrderItem toDomainItem(OrderItemJpaEntity entity) {
        return OrderItem.builder()
                .id(entity.getId())
                .tyreId(entity.getTyreId())
                .tyreName(entity.getTyreName())
                .quantity(entity.getQuantity())
                .unitPrice(entity.getUnitPrice())
                .totalPrice(entity.getTotalPrice())
                .build();
    }

    private OrderJpaEntity toJpa(Order domain) {
        return OrderJpaEntity.builder()
                .id(domain.getId())
                .dealerId(domain.getDealerId())
                .orderNumber(domain.getOrderNumber())
                .orderDate(domain.getOrderDate())
                .status(domain.getStatus())
                .totalAmount(domain.getTotalAmount())
                .items(domain.getItems().stream()
                        .map(item -> toJpaItem(item))
                        .collect(Collectors.toList()))
                .build();
    }

    private OrderItemJpaEntity toJpaItem(OrderItem domain) {
        return OrderItemJpaEntity.builder()
                .id(domain.getId())
                .tyreId(domain.getTyreId())
                .tyreName(domain.getTyreName())
                .quantity(domain.getQuantity())
                .unitPrice(domain.getUnitPrice())
                .totalPrice(domain.getTotalPrice())
                .build();
    }
}
