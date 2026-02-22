package com.tyreplus.dealer.infrastructure.persistence.adapter;

import com.tyreplus.dealer.domain.entity.SellRequest;
import com.tyreplus.dealer.domain.repository.SellRequestRepository;
import com.tyreplus.dealer.infrastructure.persistence.entity.SellRequestJpaEntity;
import com.tyreplus.dealer.infrastructure.persistence.repository.SpringDataSellRequestRepository;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class SellRequestRepositoryAdapter implements SellRequestRepository {

    private final SpringDataSellRequestRepository repository;

    public SellRequestRepositoryAdapter(SpringDataSellRequestRepository repository) {
        this.repository = repository;
    }

    @Override
    public SellRequest save(SellRequest domain) {
        SellRequestJpaEntity entity = toJpa(domain);
        SellRequestJpaEntity saved = repository.save(entity);
        return toDomain(saved);
    }

    @Override
    public List<SellRequest> findByDealerId(UUID dealerId) {
        return repository.findByDealerId(dealerId).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    private SellRequest toDomain(SellRequestJpaEntity entity) {
        List<String> images = entity.getImageUrls() != null
                ? Arrays.asList(entity.getImageUrls().split(","))
                : Collections.emptyList();

        SellRequest request = SellRequest.builder()
                .id(entity.getId())
                .dealerId(entity.getDealerId())
                .requestNumber(entity.getRequestNumber())
                .requestDate(entity.getRequestDate())
                .status(entity.getStatus())
                .tyreBrand(entity.getTyreBrand())
                .tyreSize(entity.getTyreSize())
                .tyrePattern(entity.getTyrePattern())
                .condition(entity.getCondition())
                .quantity(entity.getQuantity())
                .expectedPrice(entity.getExpectedPrice())
                .imageUrls(images)
                .build();

        // Map new fields
        request.setVehicleType(entity.getVehicleType());
        request.setTyreAge(entity.getTyreAge());
        request.setKmDriven(entity.getKmDriven());
        request.setPickupDate(entity.getPickupDate());
        request.setPickupTimeSlot(entity.getPickupTimeSlot());
        request.setMobile(entity.getMobile());

        return request;
    }

    private SellRequestJpaEntity toJpa(SellRequest domain) {
        String images = domain.getImageUrls() != null
                ? String.join(",", domain.getImageUrls())
                : null;

        return SellRequestJpaEntity.builder()
                .id(domain.getId())
                .dealerId(domain.getDealerId())
                .requestNumber(domain.getRequestNumber())
                .requestDate(domain.getRequestDate())
                .status(domain.getStatus())
                .tyreBrand(domain.getTyreBrand())
                .tyreSize(domain.getTyreSize())
                .tyrePattern(domain.getTyrePattern())
                .condition(domain.getCondition())
                .quantity(domain.getQuantity())
                .expectedPrice(domain.getExpectedPrice())
                .imageUrls(images)
                .vehicleType(domain.getVehicleType())
                .tyreAge(domain.getTyreAge())
                .kmDriven(domain.getKmDriven())
                .pickupDate(domain.getPickupDate())
                .pickupTimeSlot(domain.getPickupTimeSlot())
                .mobile(domain.getMobile())
                .build();
    }
}
