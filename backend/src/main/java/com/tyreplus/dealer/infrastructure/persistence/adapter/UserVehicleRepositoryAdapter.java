package com.tyreplus.dealer.infrastructure.persistence.adapter;

import com.tyreplus.dealer.domain.entity.UserVehicle;
import com.tyreplus.dealer.domain.repository.UserVehicleRepository;
import com.tyreplus.dealer.infrastructure.persistence.entity.UserVehicleJpaEntity;
import com.tyreplus.dealer.infrastructure.persistence.repository.SpringDataUserVehicleRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class UserVehicleRepositoryAdapter implements UserVehicleRepository {

    private final SpringDataUserVehicleRepository repository;

    public UserVehicleRepositoryAdapter(SpringDataUserVehicleRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<UserVehicle> findByDealerId(UUID dealerId) {
        return repository.findByDealerId(dealerId).stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public UserVehicle save(UserVehicle userVehicle) {
        UserVehicleJpaEntity entity = toJpa(userVehicle);
        UserVehicleJpaEntity saved = repository.save(entity);
        return toDomain(saved);
    }

    @Override
    public void deleteById(UUID id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<UserVehicle> findById(UUID id) {
        return repository.findById(id).map(this::toDomain);
    }

    private UserVehicle toDomain(UserVehicleJpaEntity entity) {
        return new UserVehicle(
                entity.getId(),
                entity.getDealerId(),
                entity.getVehicleName(),
                entity.getRegistrationNumber(),
                entity.getTyreSize(),
                entity.isPrimary(),
                entity.getMake(),
                entity.getModel(),
                entity.getVariant());
    }

    private UserVehicleJpaEntity toJpa(UserVehicle domain) {
        return UserVehicleJpaEntity.builder()
                .id(domain.getId())
                .dealerId(domain.getDealerId())
                .vehicleName(domain.getVehicleName())
                .registrationNumber(domain.getRegistrationNumber())
                .tyreSize(domain.getTyreSize())
                .isPrimary(domain.isPrimary())
                .make(domain.getMake())
                .model(domain.getModel())
                .variant(domain.getVariant())
                .build();
    }
}
