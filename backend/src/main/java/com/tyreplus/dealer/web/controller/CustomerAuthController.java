package com.tyreplus.dealer.web.controller;

import com.tyreplus.dealer.application.dto.LoginResponse;
import com.tyreplus.dealer.application.dto.OtpRequest;
import com.tyreplus.dealer.application.dto.OtpResponse;
import com.tyreplus.dealer.application.dto.VerifyOtpRequest;
import com.tyreplus.dealer.application.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

@RestController
@RequestMapping("/api/v1/auth/customer")
@Tag(name = "Customer Authentication", description = "Endpoints for Customer OTP Login")
public class CustomerAuthController {

    private final AuthService authService;

    public CustomerAuthController(AuthService authService) {
        this.authService = authService;
    }

    @Operation(summary = "Send OTP", description = "Triggers OTP SMS the customer for login.")
    @PostMapping("/send-otp")
    public ResponseEntity<OtpResponse> sendOtp(@Valid @RequestBody OtpRequest request) {
        String code = authService.generateOtp(request.mobile());
        return ResponseEntity.ok(new OtpResponse("OTP sent successfully", code));
    }

    @Operation(summary = "Verify OTP", description = "Verifies the OTP. If successful, creates/retrieves the customer and returns an auth token.", responses = {
            @ApiResponse(responseCode = "200", description = "Login successful"),
            @ApiResponse(responseCode = "400", description = "Invalid OTP")
    })
    @PostMapping("/verify-otp")
    public ResponseEntity<LoginResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        LoginResponse result = authService.verifyCustomerOtp(request);
        ResponseCookie refreshCookie = buildRefreshCookie(result.refreshToken());
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(result);
    }

    private ResponseCookie buildRefreshCookie(String refreshToken) {
        return ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true)
                .secure(true) // set false only for localhost HTTP
                .sameSite("Strict")
                .path("/api/v1/auth")
                .maxAge(Duration.ofDays(14))
                .build();
    }
}
