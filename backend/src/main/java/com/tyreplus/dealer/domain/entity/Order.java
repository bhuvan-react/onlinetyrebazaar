package com.tyreplus.dealer.domain.entity;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Order {
    private UUID id;
    private UUID dealerId;
    private String orderNumber;
    private LocalDateTime orderDate;
    private String status; // Pending, Shipped, Delivered, Cancelled
    private Double totalAmount;
    private List<OrderItem> items;
}
