package com.tyreplus.dealer.infrastructure.persistence.repository;

import com.tyreplus.dealer.infrastructure.persistence.entity.UserVehicleJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SpringDataUserVehicleRepository extends JpaRepository<UserVehicleJpaEntity, UUID> {
    List<UserVehicleJpaEntity> findByDealerId(UUID dealerId);
}
