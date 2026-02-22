package com.tyreplus.dealer.application.service;

import com.tyreplus.dealer.domain.entity.SellRequest;
import com.tyreplus.dealer.domain.repository.SellRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class SellRequestService {

    private final SellRequestRepository sellRequestRepository;

    public SellRequestService(SellRequestRepository sellRequestRepository) {
        this.sellRequestRepository = sellRequestRepository;
    }

    @Transactional
    public SellRequest submitSellRequest(UUID dealerId, SellRequest request) {
        request.setDealerId(dealerId);
        request.setRequestDate(LocalDateTime.now());
        request.setStatus("New");
        request.setRequestNumber("S-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        return sellRequestRepository.save(request);
    }

    public List<SellRequest> getSellRequests(UUID dealerId) {
        return sellRequestRepository.findByDealerId(dealerId);
    }
}
