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
public class SellRequest {
    private UUID id;
    private UUID dealerId;
    private String requestNumber;
    private LocalDateTime requestDate;
    private String status; // Pending, Approved, Rejected
    private String tyreBrand;
    private String tyreSize;
    private String tyrePattern;
    private String condition; // New, Used
    private Integer quantity;
    private Double expectedPrice;
    private List<String> imageUrls;

    // Additional fields from Frontend Form
    private String vehicleType;
    private String tyreAge;
    private Integer kmDriven;
    private String pickupDate;
    private String pickupTimeSlot;
    private String mobile;
}
