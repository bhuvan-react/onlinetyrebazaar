package com.tyreplus.dealer.application.service;

import com.tyreplus.dealer.domain.entity.SellRequest;
import com.tyreplus.dealer.domain.repository.SellRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class SellTyreService {

    private final SellRequestRepository repository;

    public SellTyreService(SellRequestRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public SellRequest submitRequest(UUID dealerId, SellRequest request) {
        request.setDealerId(dealerId);
        request.setRequestDate(LocalDateTime.now());
        request.setStatus("Pending");
        request.setRequestNumber("S-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        return repository.save(request);
    }

    public List<SellRequest> getRequests(UUID dealerId) {
        return repository.findByDealerId(dealerId);
    }
}
