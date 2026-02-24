package com.tyreplus.dealer.infrastructure.persistence.entity;

import com.tyreplus.dealer.domain.entity.LeadStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * JPA Entity for Tyre Requirement (Lead).
 */
@Entity
@Table(name = "leads")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "UUID")
    private UUID id;

    @Column(name = "tyre_id", columnDefinition = "UUID")
    private UUID tyreId;

    @Column(name = "customer_id", columnDefinition = "UUID")
    private UUID customerId;

    @Column(name = "customer_mobile")
    private String customerMobile;

    @Column(name = "vehicle_type")
    private String vehicleType;

    @Column(name = "tyre_type")
    private String tyreType;

    @Column(name = "tyre_brand")
    private String tyreBrand;

    @Column(name = "vehicle_model")
    private String vehicleModel;

    @Column(name = "location_area")
    private String locationArea;

    @Column(name = "location_pincode")
    private String locationPincode;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "status", nullable = false)
    private LeadStatus status;

    @Column(name = "tyre_size")
    private String tyreSize;

    @Column(name = "tyre_position")
    private String tyrePosition;

    @Column(name = "urgency")
    private String urgency;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "issues", columnDefinition = "jsonb")
    private java.util.List<String> issues;

    @Column(name = "usage_type")
    private String usageType;

    @Column(name = "budget")
    private String budget;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "preferences", columnDefinition = "jsonb")
    private java.util.List<String> preferences;

    @Column(name = "service_requirement")
    private String serviceRequirement;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "selected_dealer_id", columnDefinition = "UUID")
    private UUID selectedDealerId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;
}
