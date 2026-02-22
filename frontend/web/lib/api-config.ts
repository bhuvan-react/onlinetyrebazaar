export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || "/api/v1",
    MOCK_MODE: false,
    ENDPOINTS: {
        AUTH: {
            CUSTOMER: {
                SEND_OTP: "/auth/customer/send-otp",
                VERIFY_OTP: "/auth/customer/verify-otp",
            },
        },
        CUSTOMER_LEADS: {
            CREATE: "/customer/leads",
            GET_ALL: "/customer/leads",
            GET_OFFERS: (id: string) => `/customer/leads/${id}/offers`,
            SELECT_OFFER: (leadId: string, dealerId: string) => `/customer/leads/${leadId}/select-offer/${dealerId}`,
        },
        VEHICLES: {
            MAKES: "/vehicles/makes",
            MODELS: "/vehicles/models",
            VARIANTS: "/vehicles/variants",
            GET_ALL: "/vehicles",
            ADD: "/vehicles",
            DELETE: (id: string) => `/vehicles/${id}`,
        },
        LOCATION: {
            CHECK_PINCODE: "/locations/check",
        }
    },
}
