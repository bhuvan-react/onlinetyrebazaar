package com.tyreplus.dealer.infrastructure.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI Configuration for Swagger UI.
 * Configures global metadata and JWT Security Scheme.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI tyrePlusOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("TyrePlus Dealer App API")
                        .description(
                                "Backend API for TyrePlus Dealer Application. Handles authentication, wallet management, lead purchasing, and dealer profile.")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("API Support")
                                .email("support@tyreplus.com")
                                .url("https://tyreplus.com"))
                        .license(new License()
                                .name("Private License")
                                .url("https://tyreplus.com/license")))
                // Add Security Scheme for JWT
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication", createSecurityScheme()));
    }

    private SecurityScheme createSecurityScheme() {
        return new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .bearerFormat("JWT")
                .scheme("bearer");
    }
}
