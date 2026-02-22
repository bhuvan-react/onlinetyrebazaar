package com.tyreplus.dealer.domain.repository;

import com.tyreplus.dealer.domain.entity.RechargePackage;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RechargePackageRepository {

    Optional<RechargePackage> findById(UUID id);

    List<RechargePackage> findActivePackages();

    void save(RechargePackage starter);
}

