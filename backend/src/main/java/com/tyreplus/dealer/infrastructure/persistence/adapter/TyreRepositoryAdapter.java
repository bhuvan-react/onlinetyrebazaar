package com.tyreplus.dealer.infrastructure.persistence.adapter;

import com.tyreplus.dealer.domain.entity.Tyre;
import com.tyreplus.dealer.domain.repository.TyreRepository;
import com.tyreplus.dealer.infrastructure.persistence.entity.TyreJpaEntity;
import com.tyreplus.dealer.infrastructure.persistence.repository.SpringDataTyreRepository;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class TyreRepositoryAdapter implements TyreRepository {

    private final SpringDataTyreRepository repository;

    public TyreRepositoryAdapter(SpringDataTyreRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Tyre> search(String brand, String size, String pattern) {
        return repository.search(brand, size, pattern).stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public Optional<Tyre> findById(UUID id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public List<String> getAllBrands() {
        return repository.findDistinctBrands();
    }

    @Override
    public List<String> getSizesByBrand(String brand) {
        return repository.findDistinctSizesByBrand(brand);
    }

    @Override
    public List<String> getPatternsByBrandAndSize(String brand, String size) {
        return repository.findDistinctPatternsByBrandAndSize(brand, size);
    }

    private Tyre toDomain(TyreJpaEntity entity) {
        List<String> featureList = entity.getFeatures() != null
                ? Arrays.asList(entity.getFeatures().split(","))
                : Collections.emptyList();

        return Tyre.builder()
                .id(entity.getId())
                .brand(entity.getBrand())
                .pattern(entity.getPattern())
                .size(entity.getSize())
                .price(entity.getPrice())
                .productCode(entity.getProductCode())
                .features(featureList)
                .imageUrl(entity.getImageUrl())
                .warrantyYears(entity.getWarrantyYears())
                .build();
    }
}
