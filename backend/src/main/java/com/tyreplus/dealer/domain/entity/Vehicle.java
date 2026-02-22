package com.tyreplus.dealer.domain.entity;

import lombok.*;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Vehicle {
    private UUID id;
    private String type; // 2W, 4W
    private String make; // Honda
    private String model; // City
    private String variant; // VXi
    private String tyreSize; // 165/80 R14
}
