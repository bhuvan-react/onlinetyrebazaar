package com.tyreplus.dealer.application.service;

import com.tyreplus.dealer.application.dto.DashboardResponse;
import com.tyreplus.dealer.domain.entity.Lead;
import com.tyreplus.dealer.domain.entity.LeadStatus;
import com.tyreplus.dealer.domain.entity.Wallet;
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

    public DashboardService(WalletRepository walletRepository, LeadRepository leadRepository) {
        this.walletRepository = walletRepository;
        this.leadRepository = leadRepository;
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
        long convertedCount = leadRepository.countBySelectedDealerIdAndStatus(dealerId, LeadStatus.CLOSED);

        int conversionRate = totalPurchased > 0
                ? (int) ((convertedCount * 100) / totalPurchased)
                : 0;

        // 4. Get Recent Leads (Limit to 10 at the DB level)
        List<Lead> recentLeadsRaw = leadRepository.findRecentSelections(dealerId, 10);

        List<DashboardResponse.RecentLead> recentLeads = recentLeadsRaw.stream()
                .map(lead -> new DashboardResponse.RecentLead(
                        lead.getId().toString(),
                        lead.getCustomerMobile() != null ? lead.getCustomerMobile() : "Hidden", // Or placeholder name
                        formatVehicleInfo(lead),
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

    private String formatTimestamp(LocalDateTime timestamp) {
        if (timestamp == null)
            return "";
        return timestamp.format(DateTimeFormatter.ofPattern("hh:mm a"));
    }
}
