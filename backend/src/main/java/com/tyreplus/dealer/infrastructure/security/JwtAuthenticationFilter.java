package com.tyreplus.dealer.infrastructure.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * JWT Authentication Filter to validate JWT tokens in requests.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService; // Add this

    public JwtAuthenticationFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String jwt = authHeader.substring(7);
            final String mobile = jwtUtil.extractUsername(jwt); // Username is the mobile
            logger.info("JWT Validation: Extracted mobile from token: " + mobile);

            if (mobile != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Fetch the full UserDetails (DealerDetails) from our service
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(mobile);
                logger.info("JWT Validation: Loaded UserDetails for: " + userDetails.getUsername());

                if (jwtUtil.validateToken(jwt, userDetails.getUsername())) {
                    logger.info("JWT Validation: Token is VALID for " + userDetails.getUsername()
                            + ", setting Authentication");
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, // Passing the full object here
                            null,
                            userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // This is the magic line that makes @AuthenticationPrincipal work
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    logger.warn("JWT Validation: validateToken returned FALSE for " + userDetails.getUsername());
                }
            } else {
                logger.warn("JWT Validation: mobile was null (" + mobile + ") OR Context already has authentication");
            }
        } catch (Exception e) {
            logger.error("Authentication failed for URI: " + request.getRequestURI() + " | Header: "
                    + request.getHeader("Authorization"));
            logger.error("Exception details: ", e);
        }

        filterChain.doFilter(request, response);
    }
}