package com.tyreplus.dealer.infrastructure.sms;

import com.tyreplus.dealer.application.service.SmsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Console implementation of SmsService for development.
 * Logs OTP to console instead of sending actual SMS.
 */
@Service
public class ConsoleSmsService implements SmsService {

    private static final Logger logger = LoggerFactory.getLogger(ConsoleSmsService.class);

    @Override
    public void sendSms(String mobile, String message) {
        logger.info("=".repeat(60));
        logger.info("SMS TO: {}", mobile);
        logger.info("MESSAGE: {}", message);
        logger.info("=".repeat(60));
        // In production, this would call Twilio or another SMS gateway
    }
}

