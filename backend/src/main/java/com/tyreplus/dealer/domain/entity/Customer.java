package com.tyreplus.dealer.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class Customer {
    private UUID id;
    private String mobile;
    private String name;

    public Customer() {
    }
}
