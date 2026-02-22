package com.tyreplus.dealer.domain.repository;

import com.tyreplus.dealer.domain.entity.SellRequest;
import java.util.List;
import java.util.UUID;

public interface SellRequestRepository {
    SellRequest save(SellRequest request);

    List<SellRequest> findByDealerId(UUID dealerId);
}
