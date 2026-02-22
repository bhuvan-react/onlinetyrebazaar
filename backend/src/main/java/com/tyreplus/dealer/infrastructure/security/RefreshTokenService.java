package com.tyreplus.dealer.infrastructure.security;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.HashMap;
import java.util.UUID;

/**
 * In-memory refresh token store.
 * NOTE: tokens are not persisted across restarts and do not auto-expire.
 * Replace with a DB-backed or Bucket-backed implementation before production scale-out.
 */
@Service
public class RefreshTokenService {

    private final Map<String, String> tokenStore = new HashMap<>();

    public String create(UUID userId) {
        String token = UUID.randomUUID().toString();
        tokenStore.put("refresh:" + token, userId.toString());
        return token;
    }

    public UUID validate(String token) {
        String value = tokenStore.get("refresh:" + token);
        if (value == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired refresh token");
        }
        return UUID.fromString(value);
    }

    public void revoke(String token) {
        tokenStore.remove("refresh:" + token);
    }
}
