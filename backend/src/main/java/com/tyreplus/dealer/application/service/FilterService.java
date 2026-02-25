package com.tyreplus.dealer.application.service;

import com.tyreplus.dealer.domain.entity.FilterConfig;
import com.tyreplus.dealer.domain.repository.FilterConfigRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FilterService {

    private final FilterConfigRepository filterConfigRepository;
    private final TyreService tyreService;

    public FilterService(FilterConfigRepository filterConfigRepository, TyreService tyreService) {
        this.filterConfigRepository = filterConfigRepository;
        this.tyreService = tyreService;
    }

    public List<FilterConfig> getPriceRanges() {
        return filterConfigRepository.findByFilterTypeOrderBySortOrderAsc("PRICE_RANGE");
    }

    public List<FilterConfig> getRatings() {
        return filterConfigRepository.findByFilterTypeOrderBySortOrderAsc("RATING");
    }

    public List<String> getBrands() {
        // Leverages existing tyre query
        return tyreService.getAllBrands();
    }

    public List<String> getSizes() {
        return tyreService.getAllSizes();
    }
}
