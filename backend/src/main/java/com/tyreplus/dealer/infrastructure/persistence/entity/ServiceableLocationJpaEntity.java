package com.tyreplus.dealer.infrastructure.persistence.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Entity
@Table(name = "serviceable_locations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceableLocationJpaEntity {
    @Id
    private UUID id;

    @Column(nullable = false)
    private String pincode;

    private String city;
    private String state;

    @Column(name = "is_active")
    private boolean active;
}
