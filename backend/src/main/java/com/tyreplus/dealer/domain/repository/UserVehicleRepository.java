package com.tyreplus.dealer.domain.repository;

import com.tyreplus.dealer.domain.entity.UserVehicle;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserVehicleRepository {
    List<UserVehicle> findByDealerId(UUID dealerId);

    UserVehicle save(UserVehicle userVehicle);

    void deleteById(UUID id);

    Optional<UserVehicle> findById(UUID id);
}
