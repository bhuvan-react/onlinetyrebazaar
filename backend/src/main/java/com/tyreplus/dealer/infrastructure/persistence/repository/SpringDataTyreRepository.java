package com.tyreplus.dealer.infrastructure.persistence.repository;

import com.tyreplus.dealer.infrastructure.persistence.entity.TyreJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface SpringDataTyreRepository extends JpaRepository<TyreJpaEntity, UUID> {

    @Query("SELECT t FROM TyreJpaEntity t WHERE " +
            "(:brand IS NULL OR t.brand = :brand) AND " +
            "(:size IS NULL OR t.size = :size) AND " +
            "(:pattern IS NULL OR t.pattern = :pattern)")
    List<TyreJpaEntity> search(@Param("brand") String brand,
            @Param("size") String size,
            @Param("pattern") String pattern);

    @Query("SELECT DISTINCT t.brand FROM TyreJpaEntity t")
    List<String> findDistinctBrands();

    @Query("SELECT DISTINCT t.size FROM TyreJpaEntity t WHERE t.brand = :brand")
    List<String> findDistinctSizesByBrand(String brand);

    @Query("SELECT DISTINCT t.pattern FROM TyreJpaEntity t WHERE t.brand = :brand AND t.size = :size")
    List<String> findDistinctPatternsByBrandAndSize(String brand, String size);

}
