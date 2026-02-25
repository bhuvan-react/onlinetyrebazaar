package com.tyreplus.dealer.domain.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "filter_config")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FilterConfig {

    @Id
    @Builder.Default
    private UUID id = UUID.randomUUID();

    private String filterType; // PRICE_RANGE or RATING
    private String label;
    private BigDecimal minValue;
    private BigDecimal maxValue;
    private Integer sortOrder;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
