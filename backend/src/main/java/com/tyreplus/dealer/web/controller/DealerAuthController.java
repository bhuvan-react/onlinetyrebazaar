package com.tyreplus.dealer.web.controller;

import com.tyreplus.dealer.application.dto.*;
import com.tyreplus.dealer.application.service.AuthService;
import com.tyreplus.dealer.infrastructure.security.DealerDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

/**
 * REST Controller for Authentication operations.
 */
@RestController
@RequestMapping("/api/v1/auth/dealer")
@Tag(name = "Dealer Authentication", description = "Endpoints for Dealer Registration, Login, and Password Management")
public class DealerAuthController {

        private final AuthService authService;

        public DealerAuthController(AuthService authService) {
                this.authService = authService;
        }

        /**
         * 1.1 Quick Login (OTP based)
         */

        @Operation(summary = "Send Quick OTP", description = "Triggers OTP SMS to the provided mobile number for quick login.", responses = {
                        @ApiResponse(responseCode = "200", description = "OTP sent successfully"),
                        @ApiResponse(responseCode = "400", description = "Invalid mobile number")
        })
        @PostMapping("/quick/send-otp")
        public ResponseEntity<OtpResponse> sendQuickOtp(@Valid @RequestBody OtpRequest request) {
                String code = authService.generateOtp(request.mobile());
                return ResponseEntity.ok(new OtpResponse("OTP sent successfully", code));
        }

        @Operation(summary = "Verify Quick OTP", description = "Verifies the OTP. If successful, creates/retrieves the user and returns an auth token.", responses = {
                        @ApiResponse(responseCode = "200", description = "Login successful"),
                        @ApiResponse(responseCode = "400", description = "Invalid OTP")
        })
        @PostMapping("/quick/verify-otp")
        public ResponseEntity<LoginResponse> verifyQuickOtp(@Valid @RequestBody VerifyOtpRequest request) {
                LoginResponse result = authService.verifyQuickOtp(request);
                ResponseCookie refreshCookie = buildRefreshCookie(result.refreshToken());
                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                                .body(result);
        }

        /**
         * 1.2 Registration
         */

        @Operation(summary = "Send Register OTP", description = "Triggers OTP SMS for registration verification.", responses = {
                        @ApiResponse(responseCode = "200", description = "OTP sent successfully"),
                        @ApiResponse(responseCode = "400", description = "Invalid mobile number")
        })
        @PostMapping("/register/send-otp")
        public ResponseEntity<OtpResponse> sendRegisterOtp(@Valid @RequestBody OtpRequest request) {
                String code = authService.generateOtp(request.mobile());
                return ResponseEntity.ok(new OtpResponse("OTP sent successfully", code));
        }

        @Operation(summary = "Complete Registration", description = "Creates a new dealer profile after OTP is verified (verified implicitly by providing valid OTP in payload).", responses = {
                        @ApiResponse(responseCode = "200", description = "Registration successful"),
                        @ApiResponse(responseCode = "400", description = "Invalid input or Duplicate User")
        })
        @PostMapping("/register/complete")
        public ResponseEntity<LoginResponse> completeRegistration(@Valid @RequestBody RegisterRequest request) {
                LoginResponse result = authService.register(request);
                ResponseCookie refreshCookie = buildRefreshCookie(result.refreshToken());
                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                                .body(result);
        }

        /**
         * 1.3 Full Login (Password/OTP)
         * Matches spec: POST /auth/login
         */
        @Operation(summary = "Login", description = "Authenticates a dealer using Password. Returns JWT tokens.", responses = {
                        @ApiResponse(responseCode = "200", description = "Login successful"),
                        @ApiResponse(responseCode = "400", description = "Invalid credentials"),
                        @ApiResponse(responseCode = "404", description = "Dealer not found")
        })
        @PostMapping("/login")
        public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
                LoginResponse result = authService.login(request);
                ResponseCookie refreshCookie = buildRefreshCookie(result.refreshToken());
                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                                .body(result);
        }

        @Operation(summary = "Refresh Token", description = "Uses a valid Refresh Token (cookie or header) to issue a new Access Token.", responses = {
                        @ApiResponse(responseCode = "200", description = "Tokens refreshed"),
                        @ApiResponse(responseCode = "401", description = "Invalid or expired refresh token")
        })
        @PostMapping("/refresh")
        public ResponseEntity<LoginResponse> refresh(
                        @CookieValue(value = "refresh_token", required = false) String cookieToken,
                        @RequestHeader(value = "X-Refresh-Token", required = false) String headerToken) {

                String refreshToken = headerToken != null ? headerToken : cookieToken;

                if (refreshToken == null) {
                        throw new IllegalArgumentException("Refresh token missing");
                }

                return ResponseEntity.ok(authService.refresh(refreshToken));
        }

        @Operation(summary = "Logout", description = "Revokes the refresh token and clears the cookie.", responses = {
                        @ApiResponse(responseCode = "204", description = "Logout successful")
        })
        @PostMapping("/logout")
        public ResponseEntity<Void> logout(
                        @CookieValue(value = "refresh_token", required = false) String cookieToken,
                        @RequestHeader(value = "X-Refresh-Token", required = false) String headerToken) {

                String refreshToken = headerToken != null ? headerToken : cookieToken;

                if (refreshToken != null) {
                        authService.logout(refreshToken);
                }

                ResponseCookie deleteCookie = ResponseCookie
                                .from("refresh_token", "")
                                .path("/api/v1/auth")
                                .maxAge(0)
                                .build();

                return ResponseEntity.noContent()
                                .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                                .build();
        }

        /**
         * Set password (OTP-authenticated user only).
         * Requires JWT in Authorization header.
         */
        @Operation(summary = "Set Password", description = "Allows a logged-in dealer to set or change their password.", security = @SecurityRequirement(name = "Bearer Authentication"), responses = {
                        @ApiResponse(responseCode = "204", description = "Password set successfully"),
                        @ApiResponse(responseCode = "401", description = "Unauthorized")
        })
        @PostMapping("/password")
        public ResponseEntity<Void> setPassword(
                        @AuthenticationPrincipal DealerDetails dealerDetails,
                        @Valid @RequestBody SetPasswordRequest request) {
                authService.setPassword(dealerDetails.getId(), request.password());
                return ResponseEntity.noContent().build();
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
