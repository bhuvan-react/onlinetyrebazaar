package com.tyreplus.dealer.domain.repository;

import com.tyreplus.dealer.domain.entity.QuoteRequest;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface QuoteRequestRepository {
    List<QuoteRequest> findByDealerId(UUID dealerId);

    Optional<QuoteRequest> findById(UUID id);

    QuoteRequest save(QuoteRequest quoteRequest);
}
