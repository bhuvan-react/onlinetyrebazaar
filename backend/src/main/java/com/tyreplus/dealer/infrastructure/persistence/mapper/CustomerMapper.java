package com.tyreplus.dealer.infrastructure.persistence.mapper;

import com.tyreplus.dealer.domain.entity.Customer;
import com.tyreplus.dealer.infrastructure.persistence.entity.CustomerJpaEntity;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class CustomerMapper {

    public CustomerJpaEntity toJpaEntity(Customer domain) {
        if (domain == null)
            return null;
        return CustomerJpaEntity.builder()
                .id(domain.getId() != null ? domain.getId() : UUID.randomUUID())
                .mobile(domain.getMobile())
                .name(domain.getName())
                // Ensure defaults are handled correctly if needed
                .build();
    }

    public Customer toDomainEntity(CustomerJpaEntity entity) {
        if (entity == null)
            return null;
        return Customer.builder()
                .id(entity.getId())
                .mobile(entity.getMobile())
                .name(entity.getName())
                .build();
    }
}
