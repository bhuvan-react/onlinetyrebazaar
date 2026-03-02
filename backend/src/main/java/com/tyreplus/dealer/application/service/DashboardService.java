package com.tyreplus.dealer.application.service;

import com.tyreplus.dealer.application.dto.DashboardResponse;
import com.tyreplus.dealer.domain.entity.Lead;
import com.tyreplus.dealer.domain.entity.LeadStatus;
import com.tyreplus.dealer.domain.entity.Wallet;
import com.tyreplus.dealer.domain.entity.Customer;
import com.tyreplus.dealer.domain.repository.CustomerRepository;
import com.tyreplus.dealer.domain.repository.LeadRepository;
import com.tyreplus.dealer.domain.repository.WalletRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Application service for handling dashboard operations.
 */
@Service
public class DashboardService {

    private final WalletRepository walletRepository;
    private final LeadRepository leadRepository;
    private final CustomerRepository customerRepository;

    public DashboardService(WalletRepository walletRepository, LeadRepository leadRepository,
            CustomerRepository customerRepository) {
        this.walletRepository = walletRepository;
        this.leadRepository = leadRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(UUID dealerId) {
        // 1. Fetch Wallet Balance
        int walletBalance = walletRepository.findByDealerId(dealerId)
                .map(Wallet::getTotalCredits)
                .orElse(0);

        // 2. Fetch Stats Today (Database count is O(1) or O(log n) vs O(n) in Java)
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        int leadsToday = (int) leadRepository.countBySelectedDealerIdAndCreatedAtAfter(dealerId, startOfToday);

        // 3. Calculate Conversion Rate
        // Definition: (Converted Leads / Total Leads Purchased by this Dealer)
        long totalPurchased = leadRepository.countBySelectedDealerId(dealerId);
        long convertedCount = leadRepository.countBySelectedDealerIdAndStatus(dealerId, LeadStatus.CONVERTED)
                + leadRepository.countBySelectedDealerIdAndStatus(dealerId, LeadStatus.CLOSED);

        int conversionRate = totalPurchased > 0
                ? (int) ((convertedCount * 100) / totalPurchased)
                : 0;

        // 4. Get Recent Fresh Leads (available to all dealers — not just
        // dealer-selected ones)
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(
                0, 5, org.springframework.data.domain.Sort.by("createdAt").descending());
        List<Lead> recentLeadsRaw = leadRepository.findLeadsWithFilters(null, dealerId, pageable).getContent();

        List<DashboardResponse.RecentLead> recentLeads = recentLeadsRaw.stream()
                .map(lead -> new DashboardResponse.RecentLead(
                        lead.getId().toString(),
                        getCustomerName(lead.getCustomerId()),
                        formatVehicleInfo(lead),
                        lead.getTyreSize() != null ? lead.getTyreSize() : "Not Specified",
                        lead.getTyreType() != null ? lead.getTyreType() : "NEW",
                        formatLocation(lead),
                        lead.getStatus().name(),
                        formatTimestamp(lead.getCreatedAt())))
                .collect(Collectors.toList());

        return new DashboardResponse(
                walletBalance,
                new DashboardResponse.DashboardStats(leadsToday, conversionRate),
                recentLeads);
    }

    private String formatVehicleInfo(Lead lead) {
        String model = lead.getVehicleModel() != null ? lead.getVehicleModel() : "Unknown Vehicle";
        String type = lead.getVehicleType() != null ? " (" + lead.getVehicleType() + ")" : "";
        return model + type;
    }

    private String formatLocation(Lead lead) {
        String area = lead.getLocationArea() != null ? lead.getLocationArea() : "";
        String pincode = lead.getLocationPincode() != null ? lead.getLocationPincode() : "";
        return (area + " " + pincode).trim();
    }

    private String getCustomerName(UUID customerId) {
        if (customerId == null)
            return "Guest";
        return customerRepository.findById(customerId)
                .map(Customer::getName)
                .orElse("Guest");
    }

    private String formatTimestamp(LocalDateTime timestamp) {
        if (timestamp == null)
            return "";
        return timestamp.format(DateTimeFormatter.ofPattern("hh:mm a"));
    }
}
