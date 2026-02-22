package com.tyreplus.dealer.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class RechargePackage {
    private UUID id;
    private String name;
    private int priceInInr;
    private int baseCredits;
    private int bonusCredits;
    private boolean popular;
    private boolean active;

    @JsonIgnore
    public int getTotalCredits() {
        return this.baseCredits + this.bonusCredits;
    }
}