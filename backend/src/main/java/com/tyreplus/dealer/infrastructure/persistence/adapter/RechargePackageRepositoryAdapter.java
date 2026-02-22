package com.tyreplus.dealer.infrastructure.persistence.adapter;

import com.tyreplus.dealer.domain.entity.RechargePackage;
import com.tyreplus.dealer.domain.repository.RechargePackageRepository;
import com.tyreplus.dealer.infrastructure.persistence.mapper.RechargePackageMapper;
import com.tyreplus.dealer.infrastructure.persistence.repository.RechargePackageJpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class RechargePackageRepositoryAdapter implements RechargePackageRepository {

    private final RechargePackageJpaRepository jpaRepository;
    private final RechargePackageMapper mapper;

    public RechargePackageRepositoryAdapter(
            RechargePackageJpaRepository jpaRepository,
            RechargePackageMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Optional<RechargePackage> findById(UUID id) {
        return jpaRepository.findById(id).map(mapper::toDomainEntity);
    }

    @Override
    public List<RechargePackage> findActivePackages() {
        return jpaRepository
                .findByActiveTrueOrderByPriceInInrAsc()
                .stream()
                .map(mapper::toDomainEntity)
                .toList();
    }

    public void updatePackage(RechargePackage pkg) {
        jpaRepository.save(mapper.toJpaEntity(pkg));
    }

    @Override
    public void save(RechargePackage pkg) {
        jpaRepository.save(mapper.toJpaEntity(pkg));
    }
}
