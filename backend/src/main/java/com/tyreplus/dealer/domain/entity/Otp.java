package com.tyreplus.dealer.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Domain Entity representing an OTP (One-Time Password).
 */
@Getter
@Setter
@Builder
@AllArgsConstructor
public class Otp {
    private UUID id;
    private String mobile;
    private String code;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private boolean used;
    private int attempts;

    public Otp() {
        this.createdAt = LocalDateTime.now();
        this.used = false;
    }

    public Otp(String mobile, String code, LocalDateTime expiresAt) {
        this();
        this.mobile = mobile;
        this.code = code;
        this.expiresAt = expiresAt;
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    public boolean isValid() {
        return !used && !isExpired();
    }

    public void markAsUsed() {
        this.used = true;
    }
}
