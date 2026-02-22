package com.tyreplus.dealer.domain.entity;

import lombok.*;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ServiceableLocation {
    private UUID id;
    private String pincode;
    private String city;
    private String state;
    private boolean isActive;
}
