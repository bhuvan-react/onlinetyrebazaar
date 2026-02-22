package com.tyreplus.dealer.application.exception;

/**
 * Exception thrown when OTP validation fails.
 */
public class InvalidOtpException extends RuntimeException {
    
    public InvalidOtpException(String message) {
        super(message);
    }
    
    public InvalidOtpException(String message, Throwable cause) {
        super(message, cause);
    }
}

