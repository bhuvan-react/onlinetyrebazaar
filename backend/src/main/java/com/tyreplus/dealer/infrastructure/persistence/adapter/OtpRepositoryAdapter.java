package com.tyreplus.dealer.infrastructure.persistence.adapter;

import com.tyreplus.dealer.domain.entity.Otp;
import com.tyreplus.dealer.domain.repository.OtpRepository;
import com.tyreplus.dealer.infrastructure.persistence.entity.OtpJpaEntity;
import com.tyreplus.dealer.infrastructure.persistence.mapper.OtpMapper;
import com.tyreplus.dealer.infrastructure.persistence.repository.OtpJpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Adapter implementing OtpRepository using JPA.
 */
@Component
public class OtpRepositoryAdapter implements OtpRepository {

    private final OtpJpaRepository jpaRepository;
    private final OtpMapper mapper;

    public OtpRepositoryAdapter(OtpJpaRepository jpaRepository, OtpMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Otp save(Otp otp) {
        OtpJpaEntity jpaEntity = mapper.toJpaEntity(otp);
        OtpJpaEntity saved = jpaRepository.save(jpaEntity);
        return mapper.toDomainEntity(saved);
    }

    @Override
    public Optional<Otp> findByMobileAndCode(String mobile, String code) {
        return jpaRepository.findByMobileAndCode(mobile, code)
                .map(mapper::toDomainEntity);
    }

    @Override
    public List<Otp> findByMobile(String mobile) {
        return jpaRepository.findByMobileOrderByCreatedAtDesc(mobile).stream()
                .map(mapper::toDomainEntity)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void deleteByMobile(String mobile) {
        jpaRepository.deleteByMobile(mobile);
        jpaRepository.flush();
    }

    @Override
    public void deleteExpiredOtp() {
        jpaRepository.deleteExpiredOtp(LocalDateTime.now());
    }
}

