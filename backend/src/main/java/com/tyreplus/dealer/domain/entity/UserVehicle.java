package com.tyreplus.dealer.domain.entity;

import lombok.*;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserVehicle {
    private UUID id;
    private UUID dealerId; // Owner
    private String vehicleName; // e.g., "My City"
    private String registrationNumber; // KA01AB1234
    private String tyreSize;
    private boolean isPrimary;

    // Links to master data (optional but good for consistency)
    private String make;
    private String model;
    private String variant;
}
