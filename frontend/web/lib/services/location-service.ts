import { apiClient } from "../api-client"
import { API_CONFIG } from "../api-config"

export interface LocationCheckResponse {
    serviceable: boolean
    city?: string
    state?: string
    message?: string
}

export const locationService = {
    checkServiceability: async (pincode: string) => {
        const query = new URLSearchParams({ pincode })
        return apiClient.get<LocationCheckResponse>(`${API_CONFIG.ENDPOINTS.LOCATION.CHECK_PINCODE}?${query.toString()}`)
    }
}
