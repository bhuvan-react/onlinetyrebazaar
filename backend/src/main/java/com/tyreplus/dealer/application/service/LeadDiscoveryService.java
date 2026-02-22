package com.tyreplus.dealer.application.service;

import com.tyreplus.dealer.application.dto.LeadDetailsResponse;
import com.tyreplus.dealer.application.dto.LeadRequest;
import com.tyreplus.dealer.domain.entity.Customer;
import com.tyreplus.dealer.domain.entity.Lead;
import com.tyreplus.dealer.domain.entity.LeadStatus;
import com.tyreplus.dealer.domain.repository.CustomerRepository;
import com.tyreplus.dealer.domain.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeadDiscoveryService {

    private final LeadRepository leadRepository;
    private final CustomerRepository customerRepository;

    @Transactional
    public LeadDetailsResponse createLead(LeadRequest request, String customerMobile) {
        Customer customer = customerRepository.findByMobile(customerMobile)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        Lead lead = Lead.builder()
                .customerId(customer.getId())
                .customerMobile(customer.getMobile())
                .vehicleType(request.vehicleType())
                .tyreType(request.tyreType())
                .tyreBrand(request.tyreBrand())
                .vehicleModel(request.vehicleModel())
                .locationArea(request.locationArea())
                .locationPincode(request.locationPincode())
                .status(LeadStatus.VERIFIED) // Customer OTP authenticated, so verified immediately
                .build();

        Lead savedLead = leadRepository.save(lead);
        return mapToResponse(savedLead);
    }

    public List<LeadDetailsResponse> getCustomerLeads(String customerMobile) {
        Customer customer = customerRepository.findByMobile(customerMobile)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        // Use findLeadsWithFilters but for the specific customer.
        // Need to add a new method in LeadRepository, or we can use JPA's dynamic
        // finder.
        // For now, let's use the simplest approach, assuming the repository will handle
        // it.
        // I will add a method findByCustomerId to the LeadRepository.
        return leadRepository.findByCustomerId(customer.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Page<LeadDetailsResponse> getLeads(UUID dealerId, String filter, String sort, int page, int size) {
        // 1. Convert String filter to LeadStatus enum (null if "All")
        LeadStatus status = null;
        if (!"All".equalsIgnoreCase(filter)) {
            try {
                status = LeadStatus.valueOf(filter.toUpperCase());
            } catch (IllegalArgumentException e) {
                status = null; // Fallback to all if invalid status sent
            }
        }

        // 2. Setup Pagination
        Sort sortObj = "date_asc".equalsIgnoreCase(sort)
                ? Sort.by(Sort.Direction.ASC, "createdAt")
                : Sort.by(Sort.Direction.DESC, "createdAt");
        Pageable pageable = PageRequest.of(page, size, sortObj);

        // 3. Map the Page of Domain entities to Page of Response DTOs
        return leadRepository.findLeadsWithFilters(status, dealerId, pageable)
                .map(this::mapToResponse);
    }

    public Page<LeadDetailsResponse> getUnlockedLeads(UUID dealerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return leadRepository.findLeadsBySelectedDealer(dealerId, pageable)
                .map(lead -> mapToResponse(lead, dealerId));
    }

    @Transactional
    public void skipLead(UUID leadId, UUID dealerId) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new IllegalArgumentException("Lead not found"));
        // OTB logic: Dealers can just ignore the lead.
        // If we want to explicitly skip, we need a skippedBy collection (like before).
        // Since we removed it, let's just do nothing for now or log it.
        // OTB documentation doesn't strictly require server-side skipping, typically
        // it's just client-side filters.
    }

    public LeadDetailsResponse getLeadById(UUID leadId, UUID dealerId) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new IllegalArgumentException("Lead not found"));
        return mapToResponse(lead, dealerId); // Provide dealerId to check if they own it
    }

    private LeadDetailsResponse mapToResponse(Lead lead) {
        return mapToResponse(lead, null);
    }

    private LeadDetailsResponse mapToResponse(Lead lead, UUID currentDealerId) {
        // Only show customer mobile if this dealer is the selected dealer
        boolean isSelectedDealer = lead.getSelectedDealerId() != null
                && lead.getSelectedDealerId().equals(currentDealerId);
        String visibleMobile = isSelectedDealer ? lead.getCustomerMobile() : null;

        return new LeadDetailsResponse(
                lead.getId(),
                lead.getVehicleType(),
                lead.getTyreType(),
                lead.getTyreBrand(),
                lead.getVehicleModel(),
                lead.getLocationArea(),
                lead.getLocationPincode(),
                lead.getStatus(),
                visibleMobile,
                lead.getSelectedDealerId(),
                lead.getCreatedAt(),
                lead.getVerifiedAt());
    }
}