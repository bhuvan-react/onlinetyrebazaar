package com.tyreplus.dealer.domain.valueobject;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.Set;

/**
 * Value Object representing Business Hours.
 * Immutable record following DDD principles.
 */
public record BusinessHours(
        LocalTime openingTime,
        LocalTime closingTime,
        Set<DayOfWeek> openDays
) {
    public BusinessHours {
        if (openingTime == null) {
            throw new IllegalArgumentException("Opening time cannot be null");
        }
        if (closingTime == null) {
            throw new IllegalArgumentException("Closing time cannot be null");
        }

        if (openDays == null || openDays.isEmpty()) {
            throw new IllegalArgumentException("At least one open day is required");
        }

        if (closingTime.isBefore(openingTime) || closingTime.equals(openingTime)) {
            throw new IllegalArgumentException("Closing time must be after opening time");
        }
    }

    public boolean isOpenAt(LocalTime time) {
        return !time.isBefore(openingTime) && !time.isAfter(closingTime);
    }

    public boolean isOpenOn(DayOfWeek day) {
        return openDays.contains(day);
    }
}

