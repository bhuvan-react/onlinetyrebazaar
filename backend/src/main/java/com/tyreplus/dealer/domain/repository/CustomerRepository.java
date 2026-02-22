package com.tyreplus.dealer.domain.repository;

import com.tyreplus.dealer.domain.entity.Customer;

import java.util.Optional;
import java.util.UUID;

public interface CustomerRepository {
    Customer save(Customer customer);

    Optional<Customer> findById(UUID id);

    Optional<Customer> findByMobile(String mobile);
}
