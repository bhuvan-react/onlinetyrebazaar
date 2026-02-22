package com.tyreplus.dealer.infrastructure.persistence.adapter;

import com.tyreplus.dealer.domain.repository.VehicleRepository;
import com.tyreplus.dealer.infrastructure.persistence.repository.SpringDataVehicleRepository;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class VehicleRepositoryAdapter implements VehicleRepository {

    private final SpringDataVehicleRepository repository;

    public VehicleRepositoryAdapter(SpringDataVehicleRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<String> findMakes(String type) {
        return repository.findDistinctMakeByType(type);
    }

    @Override
    public List<String> findModels(String type, String make) {
        return repository.findDistinctModelByTypeAndMake(type, make);
    }

    @Override
    public List<String> findVariants(String type, String make, String model) {
        return repository.findDistinctVariantByTypeAndMakeAndModel(type, make, model);
    }

    @Override
    public List<String> findTyreSizes(String make, String model, String variant) {
        return repository.findDistinctTyreSizeByMakeAndModelAndVariant(make, model, variant);
    }
}
