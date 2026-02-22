package com.tyreplus.dealer.domain.entity;

import lombok.*;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderItem {
    private UUID id;
    private UUID tyreId; // Link to Tyre
    private String tyreName; // Snapshot
    private Integer quantity;
    private Double unitPrice;
    private Double totalPrice;
}
