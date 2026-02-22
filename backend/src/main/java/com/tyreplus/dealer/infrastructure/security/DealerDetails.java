package com.tyreplus.dealer.infrastructure.security;

import com.tyreplus.dealer.domain.entity.Dealer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public record DealerDetails(Dealer dealer) implements UserDetails {
    
    public UUID getId() { return dealer.getId(); }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_DEALER"));
    }

    @Override
    public String getPassword() {
        return dealer.getPasswordHash();
    }

    @Override
    public String getUsername() {
        return dealer.getContactDetails() != null ? dealer.getContactDetails().phoneNumber() : "";
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}