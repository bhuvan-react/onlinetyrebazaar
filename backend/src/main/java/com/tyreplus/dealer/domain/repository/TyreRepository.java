package com.tyreplus.dealer.domain.repository;

import com.tyreplus.dealer.domain.entity.Tyre;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TyreRepository {
    List<Tyre> search(String brand, String size, String pattern);

    Optional<Tyre> findById(UUID id);

    List<String> getAllBrands();

    List<String> getSizesByBrand(String brand);

    List<String> getPatternsByBrandAndSize(String brand, String size);
}
