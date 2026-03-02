package com.tyreplus.dealer.application.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

/**
 * Generates an immutable, signed consent token for dealer T&C acceptance.
 *
 * The token is a standard HS256-signed JWT containing:
 * - sub: dealer UUID (assigned after first save)
 * - event: "TERMS_ACCEPTED"
 * - version: T&C document version (e.g. "v1")
 * - ip: request origin IP
 * - iat: Unix timestamp of acceptance
 *
 * The token has NO expiry — it is a permanent audit record.
 * It is stored in dealers.consent_token with JPA updatable=false,
 * meaning Hibernate will never issue an UPDATE for this column.
 */
@Service
public class ConsentTokenService {

    private static final String TERMS_VERSION = "v1";

    @Value("${jwt.secret:tyreplus-dealer-app-secret-key-for-jwt-token-generation-minimum-256-bits-required-for-hmac-sha256}")
    private String secret;

    private SecretKey signingKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Generates a signed consent token for the given dealer.
     *
     * @param dealerId UUID of the dealer (only available after first save)
     * @param clientIp IP address from the HTTP request (for audit)
     * @return compact JWT string — to be stored once and never updated
     */
    public String generate(UUID dealerId, String clientIp) {
        return Jwts.builder()
                .subject(dealerId.toString())
                .claim("event", "TERMS_ACCEPTED")
                .claim("version", TERMS_VERSION)
                .claim("ip", clientIp != null ? clientIp : "unknown")
                .issuedAt(new Date())
                // No expiry — this is a permanent audit record
                .signWith(signingKey())
                .compact();
    }
}
