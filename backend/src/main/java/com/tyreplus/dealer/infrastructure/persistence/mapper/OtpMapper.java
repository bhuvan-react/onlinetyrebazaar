package com.tyreplus.dealer.infrastructure.persistence.mapper;

import com.tyreplus.dealer.domain.entity.Otp;
import com.tyreplus.dealer.infrastructure.persistence.entity.OtpJpaEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper between domain OTP entity and JPA entity.
 */
@Component
public class OtpMapper {

    public OtpJpaEntity toJpaEntity(Otp otp) {
        if (otp == null) {
            return null;
        }

        return OtpJpaEntity.builder()
                .id(otp.getId())
                .mobile(otp.getMobile())
                .code(otp.getCode())
                .createdAt(otp.getCreatedAt())
                .expiresAt(otp.getExpiresAt())
                .otpType(OtpJpaEntity.OtpType.LOGIN) // Defaulting to LOGIN as domain doesn't have type yet
                .attempts(otp.getAttempts())
                .used(otp.isUsed())
                .build();
    }

    public Otp toDomainEntity(OtpJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }

        return Otp.builder()
                .id(jpaEntity.getId())
                .mobile(jpaEntity.getMobile())
                .code(jpaEntity.getCode())
                .createdAt(jpaEntity.getCreatedAt())
                .expiresAt(jpaEntity.getExpiresAt())
                .attempts(jpaEntity.getAttempts())
                .used(jpaEntity.isUsed())
                .build();
    }
}
