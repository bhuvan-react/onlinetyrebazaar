package com.tyreplus.dealer.application.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

/**
 * Service responsible for sending transactional emails.
 * Uses Spring's JavaMailSender backed by any SMTP provider
 * (Gmail, SendGrid, Mailgun, etc.) configured in application.properties.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@tyrebazaar.in}")
    private String fromAddress;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    /**
     * Sends a password-reset email containing a one-click link with the token.
     */
    public void sendPasswordResetEmail(String toEmail, String dealerName, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromAddress, "Tyre Bazaar");
            helper.setTo(toEmail);
            helper.setSubject("Reset Your Password — Tyre Bazaar Dealer Portal");

            String resetLink = frontendUrl + "/reset-password?token=" + token;

            String html = "<div style='font-family:Arial,sans-serif;max-width:580px;margin:0 auto;'>" +
                    "<h2 style='color:#0D9488;'>Password Reset Request</h2>" +
                    "<p>Hi <strong>" + dealerName + "</strong>,</p>" +
                    "<p>We received a request to reset your Tyre Bazaar dealer account password.</p>" +
                    "<p>Click the button below to set a new password. This link expires in <strong>15 minutes</strong>.</p>"
                    +
                    "<div style='text-align:center;margin:32px 0;'>" +
                    "<a href='" + resetLink + "' " +
                    "style='background:#0D9488;color:#fff;padding:14px 32px;border-radius:8px;" +
                    "text-decoration:none;font-weight:bold;font-size:16px;'>Reset Password</a>" +
                    "</div>" +
                    "<p style='color:#6B7280;font-size:13px;'>If you didn't request this, ignore this email — your password won't change.</p>"
                    +
                    "<p style='color:#6B7280;font-size:13px;'>Or copy this link: <a href='" + resetLink + "'>"
                    + resetLink + "</a></p>" +
                    "</div>";

            helper.setText(html, true);
            mailSender.send(message);
            log.info("[EmailService] Password reset email sent to {}", toEmail);

        } catch (Exception e) {
            log.error("[EmailService] Failed to send password reset email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Failed to send reset email. Please try again.", e);
        }
    }
}
