package com.tyreplus.dealer.infrastructure.security;

import com.tyreplus.dealer.domain.repository.CustomerRepository;
import com.tyreplus.dealer.domain.repository.DealerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final DealerRepository dealerRepository;
    private final CustomerRepository customerRepository;

    @Override
    public UserDetails loadUserByUsername(String mobile) throws UsernameNotFoundException {
        // Try dealer first
        var dealerOpt = dealerRepository.findByMobile(mobile);
        if (dealerOpt.isPresent()) {
            return new DealerDetails(dealerOpt.get());
        }

        // Try customer next
        var customerOpt = customerRepository.findByMobile(mobile);
        if (customerOpt.isPresent()) {
            return new CustomerDetails(customerOpt.get());
        }

        throw new UsernameNotFoundException("User not found with mobile: " + mobile);
    }
}