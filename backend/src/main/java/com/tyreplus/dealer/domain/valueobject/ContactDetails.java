package com.tyreplus.dealer.domain.valueobject;

/**
 * Value Object representing Contact Details.
 * Immutable record following DDD principles.
 */
public record ContactDetails(
        String email,
        String phoneNumber,
        String alternatePhoneNumber
)
{
    public ContactDetails {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email cannot be null or blank");
        }
        if (!email.contains("@")) {
            throw new IllegalArgumentException("Email must be valid");
        }
        if (phoneNumber == null || phoneNumber.isBlank()) {
            throw new IllegalArgumentException("Phone number cannot be null or blank");
        }
    }
}

