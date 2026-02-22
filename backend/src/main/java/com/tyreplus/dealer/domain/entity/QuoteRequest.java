package com.tyreplus.dealer.domain.entity;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QuoteRequest {
    private UUID id;
    private UUID dealerId;
    private String requestNumber;
    private LocalDateTime requestDate;
    private String status; // Open, Responded, Closed
    private String details; // Description of request
    private UUID vehicleId; // Optional link
    private UUID tyreId; // Optional link
}
