package com.tyreplus.dealer.application.service;

/**
 * Interface for SMS service.
 * Implementations can use Twilio, AWS SNS, or other SMS providers.
 */
public interface SmsService {
    /**
     * Sends an SMS message to the specified mobile number.
     *
     * @param mobile the mobile number to send SMS to
     * @param message the message content
     */
    void sendSms(String mobile, String message);
}

