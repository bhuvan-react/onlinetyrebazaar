package com.tyreplus.dealer.infrastructure.persistence.mapper;

import com.tyreplus.dealer.domain.entity.Dealer;
import com.tyreplus.dealer.domain.valueobject.Address;
import com.tyreplus.dealer.domain.valueobject.BusinessHours;
import com.tyreplus.dealer.domain.valueobject.ContactDetails;
import com.tyreplus.dealer.infrastructure.persistence.entity.DealerJpaEntity;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * Mapper between domain Dealer entity and JPA entity.
 */
@Component
public class DealerMapper {

    public DealerJpaEntity toJpaEntity(Dealer dealer) {
        if (dealer == null) {
            return null;
        }

        return DealerJpaEntity.builder()
                .id(dealer.getId())
                .businessName(dealer.getBusinessName())
                .ownerName(dealer.getOwnerName())
                .isVerified(dealer.isVerified())
                .email(dealer.getContactDetails() != null ? dealer.getContactDetails().email() : null)
                .phoneNumber(dealer.getContactDetails() != null ? dealer.getContactDetails().phoneNumber() : null)
                .alternatePhoneNumber(dealer.getContactDetails() != null ? dealer.getContactDetails().alternatePhoneNumber() : null)
                .street(dealer.getAddress() != null ? dealer.getAddress().street() : null)
                .city(dealer.getAddress() != null ? dealer.getAddress().city() : null)
                .state(dealer.getAddress() != null ? dealer.getAddress().state() : null)
                .zipCode(dealer.getAddress() != null ? dealer.getAddress().zipCode() : null)
                .country(dealer.getAddress() != null ? dealer.getAddress().country() : null)
                .openingTime(dealer.getBusinessHours() != null ? dealer.getBusinessHours().openingTime() : null)
                .closingTime(dealer.getBusinessHours() != null ? dealer.getBusinessHours().closingTime() : null)
                .openDays(dealer.getBusinessHours() != null ? dealer.getBusinessHours().openDays() : Set.of())
                .passwordHash(dealer.getPasswordHash())
                .build();
    }

    public Dealer toDomainEntity(DealerJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }

        ContactDetails contactDetails = new ContactDetails(
                jpaEntity.getEmail(),
                jpaEntity.getPhoneNumber(),
                jpaEntity.getAlternatePhoneNumber()
        );

        Address address = new Address(
                jpaEntity.getStreet(),
                jpaEntity.getCity(),
                jpaEntity.getState(),
                jpaEntity.getZipCode(),
                jpaEntity.getCountry()
        );

        BusinessHours businessHours = new BusinessHours(
                jpaEntity.getOpeningTime(),
                jpaEntity.getClosingTime(),
                jpaEntity.getOpenDays()
        );

        return Dealer.builder()
                .id(jpaEntity.getId())
                .businessName(jpaEntity.getBusinessName())
                .ownerName(jpaEntity.getOwnerName())
                .isVerified(jpaEntity.isVerified())
                .passwordHash(jpaEntity.getPasswordHash())
                .contactDetails(contactDetails)
                .address(address)
                .businessHours(businessHours)
                .build();
    }
}

