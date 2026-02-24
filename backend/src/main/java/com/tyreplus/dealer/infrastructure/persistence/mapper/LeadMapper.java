package com.tyreplus.dealer.infrastructure.persistence.mapper;

import com.tyreplus.dealer.domain.entity.Lead;
import com.tyreplus.dealer.infrastructure.persistence.entity.LeadJpaEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper between domain Lead entity and JPA entity.
 */
@Component
public class LeadMapper {

    public LeadJpaEntity toJpaEntity(Lead lead) {
        if (lead == null) {
            return null;
        }

        return LeadJpaEntity.builder()
                .id(lead.getId())
                .customerId(lead.getCustomerId())
                .customerMobile(lead.getCustomerMobile())
                .vehicleType(lead.getVehicleType())
                .tyreType(lead.getTyreType())
                .tyreBrand(lead.getTyreBrand())
                .vehicleModel(lead.getVehicleModel())
                .locationArea(lead.getLocationArea())
                .locationPincode(lead.getLocationPincode())
                .tyreSize(lead.getTyreSize())
                .tyrePosition(lead.getTyrePosition())
                .urgency(lead.getUrgency())
                .issues(lead.getIssues())
                .usageType(lead.getUsageType())
                .budget(lead.getBudget())
                .preferences(lead.getPreferences())
                .serviceRequirement(lead.getServiceRequirement())
                .quantity(lead.getQuantity())
                .status(lead.getStatus())
                .selectedDealerId(lead.getSelectedDealerId())
                .tyreId(lead.getTyreId())
                .createdAt(lead.getCreatedAt())
                .verifiedAt(lead.getVerifiedAt())
                .build();
    }

    public Lead toDomainEntity(LeadJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }

        return Lead.builder()
                .id(jpaEntity.getId())
                .customerId(jpaEntity.getCustomerId())
                .customerMobile(jpaEntity.getCustomerMobile())
                .vehicleType(jpaEntity.getVehicleType())
                .tyreType(jpaEntity.getTyreType())
                .tyreBrand(jpaEntity.getTyreBrand())
                .vehicleModel(jpaEntity.getVehicleModel())
                .locationArea(jpaEntity.getLocationArea())
                .locationPincode(jpaEntity.getLocationPincode())
                .tyreSize(jpaEntity.getTyreSize())
                .tyrePosition(jpaEntity.getTyrePosition())
                .urgency(jpaEntity.getUrgency())
                .issues(jpaEntity.getIssues())
                .usageType(jpaEntity.getUsageType())
                .budget(jpaEntity.getBudget())
                .preferences(jpaEntity.getPreferences())
                .serviceRequirement(jpaEntity.getServiceRequirement())
                .quantity(jpaEntity.getQuantity())
                .status(jpaEntity.getStatus())
                .selectedDealerId(jpaEntity.getSelectedDealerId())
                .tyreId(jpaEntity.getTyreId())
                .createdAt(jpaEntity.getCreatedAt())
                .verifiedAt(jpaEntity.getVerifiedAt())
                .build();
    }
}
