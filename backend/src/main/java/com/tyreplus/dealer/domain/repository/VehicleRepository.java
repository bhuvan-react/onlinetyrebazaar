package com.tyreplus.dealer.domain.repository;

import com.tyreplus.dealer.domain.entity.Vehicle;
import java.util.List;
import java.util.Optional;

public interface VehicleRepository {
    List<String> findMakes(String type);

    List<String> findModels(String type, String make);

    List<String> findVariants(String type, String make, String model);

    List<String> findTyreSizes(String make, String model, String variant);
}
