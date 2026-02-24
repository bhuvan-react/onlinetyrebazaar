package com.tyreplus.dealer.infrastructure.sms;

import com.tyreplus.dealer.application.service.SmsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * WhatsApp implementation of SmsService using MSG91's REST API.
 *
 * <p>
 * Activated by setting the Spring profile "whatsapp":
 * {@code SPRING_PROFILES_ACTIVE=whatsapp}
 *
 * <p>
 * Required environment variables (set these before starting the backend):
 * <ul>
 * <li>MSG91_AUTH_KEY – your MSG91 Auth Key (Dashboard → API Keys)</li>
 * <li>MSG91_INTEGRATED_NUMBER – your WhatsApp Business number registered in
 * MSG91
 * (with country code, no +, e.g. "919876543210")</li>
 * <li>MSG91_TEMPLATE_NAME – the approved WhatsApp template name (e.g.
 * "tyreplus_otp")</li>
 * </ul>
 *
 * <p>
 * The template must have a single body variable ({{1}}) which this service
 * fills
 * with the extracted OTP code. Example template body:
 * 
 * <pre>
 * "Your TyrePlus OTP is {{1}}. Valid for 5 minutes. Do not share it with anyone."
 * </pre>
 */
@Service
@Profile("whatsapp")
public class Msg91WhatsAppSmsService implements SmsService {

    private static final Logger logger = LoggerFactory.getLogger(Msg91WhatsAppSmsService.class);

    private static final String MSG91_API_URL = "https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/";

    private static final Pattern OTP_PATTERN = Pattern.compile("(\\d{4,6})");

    @Value("${msg91.auth-key}")
    private String authKey;

    @Value("${msg91.integrated-number}")
    private String integratedNumber;

    @Value("${msg91.template-name:tyreplus_otp}")
    private String templateName;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Override
    public void sendSms(String mobile, String message) {
        // Extract OTP digits from the message string (e.g. "Your TyrePlus code is:
        // 1234")
        String otpCode = extractOtpCode(message);

        // MSG91 expects the recipient number without "+" but with country code
        String normalizedMobile = normalizeMobile(mobile);

        String requestBody = buildRequestBody(normalizedMobile, otpCode);

        logger.info("[MSG91] Sending WhatsApp OTP to {} using template '{}'", normalizedMobile, templateName);
        logger.debug("[MSG91] Request body: {}", requestBody);

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(MSG91_API_URL))
                    .header("authkey", authKey)
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                logger.info("[MSG91] WhatsApp OTP sent successfully to {}. Response: {}", normalizedMobile,
                        response.body());
            } else {
                logger.error("[MSG91] Failed to send WhatsApp OTP to {}. HTTP {}: {}",
                        normalizedMobile, response.statusCode(), response.body());
                throw new RuntimeException(
                        "MSG91 WhatsApp API error: HTTP " + response.statusCode() + " — " + response.body());
            }

        } catch (java.io.IOException | InterruptedException e) {
            logger.error("[MSG91] Exception while sending WhatsApp OTP to {}: {}", normalizedMobile, e.getMessage(), e);
            if (e instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            throw new RuntimeException("Failed to send WhatsApp OTP via MSG91", e);
        }
    }

    /**
     * Builds the MSG91 JSON payload.
     *
     * <p>
     * Structure per MSG91 WhatsApp bulk API:
     * 
     * <pre>
     * {
     *   "integrated_number": "919876543210",
     *   "content_type": "template",
     *   "payload": {
     *     "to": "919876543210",
     *     "type": "template",
     *     "template": {
     *       "name": "tyreplus_otp",
     *       "language": { "code": "en" },
     *       "components": [
     *         {
     *           "type": "body",
     *           "parameters": [
     *             { "type": "text", "text": "1234" }
     *           ]
     *         }
     *       ]
     *     }
     *   }
     * }
     * </pre>
     */
    private String buildRequestBody(String recipientMobile, String otpCode) {
        return "{"
                + "\"integrated_number\":\"" + integratedNumber + "\","
                + "\"content_type\":\"template\","
                + "\"payload\":{"
                + "  \"to\":\"" + recipientMobile + "\","
                + "  \"type\":\"template\","
                + "  \"template\":{"
                + "    \"name\":\"" + templateName + "\","
                + "    \"language\":{\"code\":\"en\"},"
                + "    \"components\":["
                + "      {"
                + "        \"type\":\"body\","
                + "        \"parameters\":["
                + "          {\"type\":\"text\",\"text\":\"" + otpCode + "\"}"
                + "        ]"
                + "      }"
                + "    ]"
                + "  }"
                + "}"
                + "}";
    }

    /**
     * Extracts the 4–6 digit OTP code from a message like "Your TyrePlus code is:
     * 1234".
     * Falls back to the full message if no numeric code is found.
     */
    private String extractOtpCode(String message) {
        Matcher matcher = OTP_PATTERN.matcher(message);
        return matcher.find() ? matcher.group(1) : message;
    }

    /**
     * Normalises the mobile number to the format MSG91 expects:
     * digits only, with country code, no "+" prefix.
     *
     * <p>
     * Examples:
     * <ul>
     * <li>"+919876543210" → "919876543210"</li>
     * <li>"09876543210" → "919876543210" (assumes India +91)</li>
     * <li>"9876543210" → "919876543210" (assumes India +91)</li>
     * </ul>
     */
    private String normalizeMobile(String mobile) {
        // Strip all non-digit characters (e.g. "+", spaces, "-")
        String digits = mobile.replaceAll("[^\\d]", "");

        if (digits.startsWith("91") && digits.length() == 12) {
            return digits; // already has country code
        }
        if (digits.startsWith("0") && digits.length() == 11) {
            return "91" + digits.substring(1); // strip leading 0, add +91
        }
        if (digits.length() == 10) {
            return "91" + digits; // bare 10-digit Indian number
        }
        // For international numbers already including a different country code, return
        // as-is
        return digits;
    }
}
