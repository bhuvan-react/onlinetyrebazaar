import { fetchWithMockFallback } from "../api-client"
import { API_CONFIG } from "../api-config"

interface UserInfo {
    id: string
    name: string
    role: string
    avatar?: string
}

interface LoginResponse {
    token: string
    refreshToken: string
    user: UserInfo
}

interface OtpResponse {
    message: string
    otp?: string
}

export const authService = {
    sendCustomerOtp: async (mobile: string) => {
        return fetchWithMockFallback<OtpResponse>(
            API_CONFIG.ENDPOINTS.AUTH.CUSTOMER.SEND_OTP,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mobile }),
            }
        )
    },

    verifyCustomerOtp: async (mobile: string, otp: string) => {
        return fetchWithMockFallback<LoginResponse>(
            API_CONFIG.ENDPOINTS.AUTH.CUSTOMER.VERIFY_OTP,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mobile, otp }),
            }
        )
    }
}
