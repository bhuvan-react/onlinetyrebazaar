package com.tyreplus.dealer.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "user_vehicles")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserVehicleJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "dealer_id", nullable = false)
    private UUID dealerId;

    @Column(name = "vehicle_name")
    private String vehicleName;

    @Column(name = "registration_number")
    private String registrationNumber;

    @Column(name = "tyre_size")
    private String tyreSize;

    @Column(name = "is_primary")
    private boolean isPrimary;

    @Column(name = "make")
    private String make;

    @Column(name = "model")
    private String model;

    @Column(name = "variant")
    private String variant;
}
