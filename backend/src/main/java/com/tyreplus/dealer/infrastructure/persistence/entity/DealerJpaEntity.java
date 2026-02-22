package com.tyreplus.dealer.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.DayOfWeek;
import java.util.Set;
import java.util.UUID;

/**
 * JPA Entity for Dealer.
 * Maps domain entity to database table.
 */
@Entity
@Table(name = "dealers")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DealerJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "UUID")
    private UUID id;

    @Column(name = "business_name", nullable = false)
    private String businessName;

    @Column(name = "owner_name", nullable = false)
    private String ownerName;

    @Column(name = "is_verified", nullable = false)
    private boolean isVerified;

    @Column(name ="password_hash")
    private String passwordHash;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "phone_number", nullable = false, unique = true)
    private String phoneNumber;

    @Column(name = "alternate_phone_number")
    private String alternatePhoneNumber;

    @Column(name = "street", nullable = false)
    private String street;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "state")
    private String state;

    @Column(name = "zip_code", nullable = false)
    private String zipCode;

    @Column(name = "country", nullable = false)
    private String country;

    @Column(name = "opening_time", nullable = false)
    private java.time.LocalTime openingTime;

    @Column(name = "closing_time", nullable = false)
    private java.time.LocalTime closingTime;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "dealer_open_days",
            joinColumns = @JoinColumn(name = "dealer_id")
    )
    @Column(name = "open_day", nullable = false)
    @Enumerated(EnumType.STRING)
    private Set<DayOfWeek> openDays;
}

