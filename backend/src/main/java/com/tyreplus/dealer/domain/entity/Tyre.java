package com.tyreplus.dealer.domain.entity;

import lombok.*;
import java.util.UUID;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Tyre {
    private UUID id;
    private String brand;
    private String pattern;
    private String size;
    private Double price;
    private String productCode;
    // Assuming features like 'Low Noise', 'High Grip'
    private List<String> features;
    private String imageUrl;
    private Integer warrantyYears;
}
