package com.tyreplus.dealer.application.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * Request DTO for Quick OTP Verification.
 *
 * Jackson requires parameter names when deserialising records.  The project
 * is not compiled with `-parameters`, so we explicitly annotate each
 * component with @JsonProperty and provide a @JsonCreator constructor.  This
 * ensures that the optional `name` field is not dropped during JSON
 * deserialization (which formerly resulted in every customer being created
 * with the default "Guest" name).
 */
public record VerifyOtpRequest(
        @JsonProperty("mobile")
        @NotBlank(message = "Mobile number is required") @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be 10 digits") String mobile,

        @JsonProperty("otp")
        @NotBlank(message = "OTP is required") @Pattern(regexp = "^[0-9]{4,6}$", message = "OTP must be 4 to 6 digits") String otp,

        @JsonProperty("name")
        String name) {

    @JsonCreator
    public VerifyOtpRequest(
            @JsonProperty("mobile") String mobile,
            @JsonProperty("otp") String otp,
            @JsonProperty("name") String name) {
        this.mobile = mobile;
        this.otp = otp;
        this.name = name;
    }
}
