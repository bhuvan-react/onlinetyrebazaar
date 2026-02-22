package com.tyreplus.dealer.application.dto;

import java.util.List;

/**
 * Response DTO for Dashboard.
 * Java 21 Record following DDD principles.
 */
public record DashboardResponse(
        int walletBalance,
        DashboardStats stats,
        List<RecentLead> recentLeads
) {
    public record DashboardStats(
            int leadsToday,
            int conversionRate
    ) {
    }
    
    public record RecentLead(
            String id,
            String customerName,
            String vehicle,
            String status,
            String timestamp
    ) {
    }
}

