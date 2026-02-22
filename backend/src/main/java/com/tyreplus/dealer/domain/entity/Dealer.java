package com.tyreplus.dealer.domain.entity;

import com.tyreplus.dealer.domain.valueobject.Address;
import com.tyreplus.dealer.domain.valueobject.BusinessHours;
import com.tyreplus.dealer.domain.valueobject.ContactDetails;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

/**
 * Domain Entity representing a Dealer.
 * Pure domain model without JPA annotations.
 */
@Getter
@Setter
@Builder
@AllArgsConstructor
public class Dealer {
    private UUID id;
    private String businessName;
    private String ownerName;
    private boolean isVerified;
    private String passwordHash;
    private ContactDetails contactDetails;
    private Address address;
    private BusinessHours businessHours;

    public void verify() {
        this.isVerified = true;
    }

    public void unverify() {
        this.isVerified = false;
    }

    public void updateContactDetails(ContactDetails newContactDetails) {
        if (newContactDetails == null) {
            throw new IllegalArgumentException("Contact details cannot be null");
        }
        this.contactDetails = newContactDetails;
    }

    public void updateBusinessHours(BusinessHours newBusinessHours) {
        if (newBusinessHours == null) {
            throw new IllegalArgumentException("Business hours cannot be null");
        }
        this.businessHours = newBusinessHours;
    }
}

