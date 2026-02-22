package com.tyreplus.dealer.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "offers")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OfferJpaEntity {

    @Id
    @UuidGenerator
    @Column(columnDefinition = "uuid", updatable = false)
    private UUID id;

    @Column(nullable = false)
    private UUID leadId;

    @Column(nullable = false)
    private UUID dealerId;

    @Column(nullable = false)
    private int price;

    @Column(nullable = false)
    private String tyreCondition; // New, Used (Excellent / Good / Cheap)

    @Column(nullable = false)
    private boolean stockAvailable;

    @ElementCollection
    @CollectionTable(name = "offer_images", joinColumns = @JoinColumn(name = "offer_id"))
    @Column(name = "image_url")
    private List<String> imageUrls;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
