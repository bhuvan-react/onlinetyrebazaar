package com.tyreplus.dealer.domain.repository;

import com.tyreplus.dealer.domain.entity.UserVehicle;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserVehicleRepository {
    List<UserVehicle> findByDealerId(UUID dealerId);

    UserVehicle save(UserVehicle userVehicle);

    List<UserVehicle> saveAll(List<UserVehicle> vehicles);

    void deleteById(UUID id);

    Optional<UserVehicle> findById(UUID id);
}
