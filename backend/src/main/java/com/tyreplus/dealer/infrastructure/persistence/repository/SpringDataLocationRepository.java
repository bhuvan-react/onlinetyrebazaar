package com.tyreplus.dealer.infrastructure.persistence.repository;

import com.tyreplus.dealer.infrastructure.persistence.entity.ServiceableLocationJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface SpringDataLocationRepository extends JpaRepository<ServiceableLocationJpaEntity, UUID> {
    Optional<ServiceableLocationJpaEntity> findByPincode(String pincode);
}
