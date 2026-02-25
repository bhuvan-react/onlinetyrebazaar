package com.tyreplus.dealer.domain.repository;

import com.tyreplus.dealer.domain.entity.FilterConfig;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FilterConfigRepository extends JpaRepository<FilterConfig, UUID> {
    List<FilterConfig> findByFilterTypeOrderBySortOrderAsc(String filterType);
}
