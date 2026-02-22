package com.tyreplus.dealer.application.service;

import com.tyreplus.dealer.domain.entity.Tyre;
import com.tyreplus.dealer.domain.repository.TyreRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TyreService {

    private final TyreRepository tyreRepository;

    public TyreService(TyreRepository tyreRepository) {
        this.tyreRepository = tyreRepository;
    }

    public List<Tyre> searchTyres(String brand, String size, String pattern) {
        return tyreRepository.search(brand, size, pattern);
    }

    public Optional<Tyre> getTyreDetails(UUID id) {
        return tyreRepository.findById(id);
    }

    public List<String> getAllBrands() {
        return tyreRepository.getAllBrands();
    }

    public List<String> getSizesByBrand(String brand) {
        return tyreRepository.getSizesByBrand(brand);
    }
}
