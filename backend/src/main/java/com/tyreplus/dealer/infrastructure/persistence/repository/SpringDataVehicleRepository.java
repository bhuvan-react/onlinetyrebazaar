package com.tyreplus.dealer.infrastructure.persistence.repository;

import com.tyreplus.dealer.infrastructure.persistence.entity.VehicleJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.UUID;

public interface SpringDataVehicleRepository extends JpaRepository<VehicleJpaEntity, UUID> {

    @Query("SELECT DISTINCT v.make FROM VehicleJpaEntity v WHERE v.type = :type")
    List<String> findDistinctMakeByType(String type);

    @Query("SELECT DISTINCT v.model FROM VehicleJpaEntity v WHERE v.type = :type AND v.make = :make")
    List<String> findDistinctModelByTypeAndMake(String type, String make);

    @Query("SELECT DISTINCT v.variant FROM VehicleJpaEntity v WHERE v.type = :type AND v.make = :make AND v.model = :model")
    List<String> findDistinctVariantByTypeAndMakeAndModel(String type, String make, String model);

    @Query("SELECT DISTINCT v.tyreSize FROM VehicleJpaEntity v WHERE v.make = :make AND v.model = :model AND v.variant = :variant")
    List<String> findDistinctTyreSizeByMakeAndModelAndVariant(String make, String model, String variant);
}
