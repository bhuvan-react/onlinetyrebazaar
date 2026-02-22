package com.tyreplus.dealer.application.service;

import com.tyreplus.dealer.domain.entity.ServiceableLocation;
import com.tyreplus.dealer.domain.repository.LocationRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LocationService {

    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public Optional<ServiceableLocation> checkServiceability(String pincode) {
        return locationRepository.findByPincode(pincode)
                .filter(ServiceableLocation::isActive);
    }
}
