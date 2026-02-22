package com.tyreplus.dealer.infrastructure.security;

/*
import io.github.bucket4j.BucketConfiguration;
import java.time.Duration;
*/

public final class RateLimitPolicy {

        private RateLimitPolicy() {
        }

        /*
         * public static BucketConfiguration otp() {
         * return BucketConfiguration.builder()
         * .addLimit(limit -> limit.capacity(5).refillGreedy(5, Duration.ofMinutes(1)))
         * .build();
         * }
         * 
         * public static BucketConfiguration auth() {
         * return BucketConfiguration.builder()
         * .addLimit(limit -> limit.capacity(10).refillGreedy(10,
         * Duration.ofMinutes(1)))
         * .build();
         * }
         * 
         * public static BucketConfiguration read() {
         * return BucketConfiguration.builder()
         * .addLimit(limit -> limit.capacity(20)
         * .refillGreedy(20, Duration.ofSeconds(1)))
         * 
         * // Sustained: 300 per minute
         * .addLimit(limit -> limit.capacity(300)
         * .refillGreedy(300, Duration.ofMinutes(1)))
         * 
         * .build();
         * }
         * 
         * public static BucketConfiguration write() {
         * return BucketConfiguration.builder()
         * .addLimit(limit -> limit.capacity(5)
         * .refillGreedy(5, Duration.ofSeconds(1)))
         * 
         * // Sustained: 60 per minute
         * .addLimit(limit -> limit.capacity(60)
         * .refillGreedy(60, Duration.ofMinutes(1)))
         * .build();
         * }
         */
}