package com.tyreplus.dealer.domain.repository;

import com.tyreplus.dealer.domain.entity.Otp;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for OTP entity.
 * Part of the domain layer - no framework dependencies.
 */
public interface OtpRepository {
    Otp save(Otp otp);
    Optional<Otp> findByMobileAndCode(String mobile, String code);
    List<Otp> findByMobile(String mobile);
    void deleteById(java.util.UUID id);
    void deleteByMobile(String mobile);
    void deleteExpiredOtp();
}

