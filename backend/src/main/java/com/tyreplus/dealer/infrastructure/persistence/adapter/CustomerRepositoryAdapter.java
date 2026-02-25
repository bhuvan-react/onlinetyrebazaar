package com.tyreplus.dealer.infrastructure.persistence.adapter;

import com.tyreplus.dealer.domain.entity.Customer;
import com.tyreplus.dealer.domain.repository.CustomerRepository;
import com.tyreplus.dealer.infrastructure.persistence.entity.CustomerJpaEntity;
import com.tyreplus.dealer.infrastructure.persistence.mapper.CustomerMapper;
import com.tyreplus.dealer.infrastructure.persistence.repository.CustomerJpaRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
public class CustomerRepositoryAdapter implements CustomerRepository {

    private final CustomerJpaRepository jpaRepository;
    private final CustomerMapper mapper;

    public CustomerRepositoryAdapter(CustomerJpaRepository jpaRepository, CustomerMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Customer save(Customer customer) {
        CustomerJpaEntity entity;
        if (customer.getId() != null) {
            entity = jpaRepository.findById(customer.getId())
                    .orElse(mapper.toJpaEntity(customer));
            // Update fields that are mapped from Domain
            entity.setMobile(customer.getMobile());
            entity.setName(customer.getName());
        } else {
            entity = mapper.toJpaEntity(customer);
        }

        CustomerJpaEntity saved = jpaRepository.save(entity);
        return mapper.toDomainEntity(saved);
    }

    @Override
    public Optional<Customer> findById(UUID id) {
        return jpaRepository.findById(id).map(mapper::toDomainEntity);
    }

    @Override
    public Optional<Customer> findByMobile(String mobile) {
        return jpaRepository.findByMobile(mobile).map(mapper::toDomainEntity);
    }
}
