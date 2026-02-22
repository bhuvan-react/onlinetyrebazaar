package com.tyreplus.dealer.infrastructure.persistence.adapter;

import com.tyreplus.dealer.domain.entity.QuoteRequest;
import com.tyreplus.dealer.domain.repository.QuoteRequestRepository;
import com.tyreplus.dealer.infrastructure.persistence.entity.QuoteRequestJpaEntity;
import com.tyreplus.dealer.infrastructure.persistence.repository.SpringDataQuoteRequestRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class QuoteRequestRepositoryAdapter implements QuoteRequestRepository {

    private final SpringDataQuoteRequestRepository repository;

    public QuoteRequestRepositoryAdapter(SpringDataQuoteRequestRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<QuoteRequest> findByDealerId(UUID dealerId) {
        return repository.findByDealerId(dealerId).stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public Optional<QuoteRequest> findById(UUID id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public QuoteRequest save(QuoteRequest domain) {
        QuoteRequestJpaEntity entity = toJpa(domain);
        QuoteRequestJpaEntity saved = repository.save(entity);
        return toDomain(saved);
    }

    private QuoteRequest toDomain(QuoteRequestJpaEntity entity) {
        return QuoteRequest.builder()
                .id(entity.getId())
                .dealerId(entity.getDealerId())
                .requestNumber(entity.getRequestNumber())
                .requestDate(entity.getRequestDate())
                .status(entity.getStatus())
                .details(entity.getDetails())
                .vehicleId(entity.getVehicleId())
                .tyreId(entity.getTyreId())
                .build();
    }

    private QuoteRequestJpaEntity toJpa(QuoteRequest domain) {
        return QuoteRequestJpaEntity.builder()
                .id(domain.getId())
                .dealerId(domain.getDealerId())
                .requestNumber(domain.getRequestNumber())
                .requestDate(domain.getRequestDate())
                .status(domain.getStatus())
                .details(domain.getDetails())
                .vehicleId(domain.getVehicleId())
                .tyreId(domain.getTyreId())
                .build();
    }
}
