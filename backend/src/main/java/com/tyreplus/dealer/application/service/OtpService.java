package com.tyreplus.dealer.application.service;

import com.tyreplus.dealer.application.exception.InvalidOtpException;
import com.tyreplus.dealer.domain.entity.Otp;
import com.tyreplus.dealer.domain.repository.OtpRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

/**
 * Service for managing OTP generation and validation.
 */
@Service
public class OtpService {

    private final OtpRepository otpRepository;
    private final SmsService smsService;
    private final SecureRandom random = new SecureRandom();

    public OtpService(OtpRepository otpRepository, SmsService smsService) {
        this.otpRepository = otpRepository;
        this.smsService = smsService;
    }

    @Transactional
    public String generateOtp(String mobile) {
        String code = String.valueOf(1000 + random.nextInt(9000)); // 4 digit OTP

        // Invalidate previous OTPs? Or rely on timestamp.
        // For simplicity, we just save a new one.
        Otp otp = new Otp(mobile, code, LocalDateTime.now().plusMinutes(5));
        otpRepository.save(otp);

        smsService.sendSms(mobile, "Your TyrePlus code is: " + code);
        return code;
    }

    @Transactional
    public void validateOtp(String mobile, String code) {
        // 1. Fetch latest valid OTP
        List<Otp> otps = otpRepository.findByMobile(mobile);
        if (otps.isEmpty()) {
            throw new InvalidOtpException("No OTP found for this mobile number.");
        }
        Otp latestOtp = otps.get(0); // Assuming ordered by created_at desc

        // 2. Check if blocked/max attempts reached on this OTP?
        // Actually blocking logic might be complex if not tied to specific OTP.
        // For now, let's limit attempts on the specific OTP entity.
        if (latestOtp.getAttempts() >= 3) {
            throw new InvalidOtpException("Too many failed attempts. Request a new OTP.");
        }

        if (latestOtp.isExpired()) {
            throw new InvalidOtpException("OTP expired.");
        }

        if (latestOtp.isUsed()) {
            throw new InvalidOtpException("OTP already used.");
        }

        // 3. Compare
        if (!latestOtp.getCode().equals(code)) {
            latestOtp.setAttempts(latestOtp.getAttempts() + 1);
            otpRepository.save(latestOtp);
            int remaining = Math.max(0, 3 - latestOtp.getAttempts());
            throw new InvalidOtpException("Invalid OTP. Attempts remaining: " + remaining);
        }

        // 4. Success: Mark as used
        latestOtp.markAsUsed();
        otpRepository.save(latestOtp);
    }
}
