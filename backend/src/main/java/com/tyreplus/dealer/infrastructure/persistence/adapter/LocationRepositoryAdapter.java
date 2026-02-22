package com.tyreplus.dealer.infrastructure.persistence.adapter;

import com.tyreplus.dealer.domain.entity.ServiceableLocation;
import com.tyreplus.dealer.domain.repository.LocationRepository;
import com.tyreplus.dealer.infrastructure.persistence.entity.ServiceableLocationJpaEntity;
import com.tyreplus.dealer.infrastructure.persistence.repository.SpringDataLocationRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class LocationRepositoryAdapter implements LocationRepository {

    private final SpringDataLocationRepository repository;

    public LocationRepositoryAdapter(SpringDataLocationRepository repository) {
        this.repository = repository;
    }

    @Override
    public Optional<ServiceableLocation> findByPincode(String pincode) {
        return repository.findByPincode(pincode).map(this::toDomain);
    }

    private ServiceableLocation toDomain(ServiceableLocationJpaEntity entity) {
        return ServiceableLocation.builder()
                .id(entity.getId())
                .pincode(entity.getPincode())
                .city(entity.getCity())
                .state(entity.getState())
                .isActive(entity.isActive())
                .build();
    }
}
