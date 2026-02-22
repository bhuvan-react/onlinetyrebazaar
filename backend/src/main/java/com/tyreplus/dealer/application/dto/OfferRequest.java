package com.tyreplus.dealer.application.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record OfferRequest(
        @NotNull(message = "Price is required") @Min(value = 1, message = "Price must be greater than zero") Integer price,

        @NotBlank(message = "Tyre condition is required") String tyreCondition, // "New", "Used (Excellent)", "Used
                                                                                // (Good)", "Used (Cheap)"

        @NotNull(message = "Stock availability is required") Boolean stockAvailable,

        List<String> imageUrls // Optional images, especially for used tyres
) {
}
