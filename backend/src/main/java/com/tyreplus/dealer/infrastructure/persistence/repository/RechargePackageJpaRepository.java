package com.tyreplus.dealer.infrastructure.persistence.repository;

import com.tyreplus.dealer.infrastructure.persistence.entity.RechargePackageJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RechargePackageJpaRepository extends JpaRepository<RechargePackageJpaEntity, UUID> {
    List<RechargePackageJpaEntity> findByActiveTrueOrderByPriceInInrAsc();
}