package com.tyreplus.dealer.application.service;

import com.tyreplus.dealer.domain.entity.UserVehicle;
import com.tyreplus.dealer.domain.repository.UserVehicleRepository;
import com.tyreplus.dealer.domain.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserVehicleRepository userVehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository, UserVehicleRepository userVehicleRepository) {
        this.vehicleRepository = vehicleRepository;
        this.userVehicleRepository = userVehicleRepository;
    }

    // Master Data
    public List<String> getMakes(String type) {
        return vehicleRepository.findMakes(type);
    }

    public List<String> getModels(String type, String make) {
        return vehicleRepository.findModels(type, make);
    }

    public List<String> getVariants(String type, String make, String model) {
        return vehicleRepository.findVariants(type, make, model);
    }

    public List<String> getTyreSizes(String make, String model, String variant) {
        return vehicleRepository.findTyreSizes(make, model, variant);
    }

    // Garage
    public List<UserVehicle> getUserVehicles(UUID dealerId) {
        return userVehicleRepository.findByDealerId(dealerId);
    }

    @Transactional
    public UserVehicle addUserVehicle(UUID dealerId, UserVehicle vehicle) {
        vehicle.setDealerId(dealerId);
        // Ensure only one primary? Logic could be here.
        return userVehicleRepository.save(vehicle);
    }

    @Transactional
    public void deleteUserVehicle(UUID dealerId, UUID vehicleId) {
        userVehicleRepository.findById(vehicleId).ifPresent(v -> {
            if (v.getDealerId().equals(dealerId)) {
                userVehicleRepository.deleteById(vehicleId);
            } else {
                throw new IllegalArgumentException("Vehicle does not belong to user");
            }
        });
    }
}
