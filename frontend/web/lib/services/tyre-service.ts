import { fetchWithMockFallback } from "../api-client"
import { API_CONFIG } from "../api-config"
import { tyreData, type Tyre } from "../tyre-data"

export interface TyreFilters {
    size?: string
    brand?: string
    pattern?: string
    categoryId?: string
}

export const tyreService = {
    getAllTyres: async (filters?: TyreFilters) => {
        let endpoint = API_CONFIG.ENDPOINTS.TYRES.GET_ALL

        if (filters) {
            const queryParams = new URLSearchParams()
            if (filters.size) queryParams.append("size", filters.size)
            if (filters.brand) queryParams.append("brand", filters.brand)
            if (filters.pattern) queryParams.append("pattern", filters.pattern)
            if (filters.categoryId) queryParams.append("categoryId", filters.categoryId)

            const queryString = queryParams.toString()
            if (queryString) {
                endpoint += `?${queryString}`
            }
        }

        return fetchWithMockFallback<Tyre[]>(endpoint, {}, tyreData)
    },

    getTyreById: async (id: string) => {
        // For mock implementation, we filter the mock data
        const mockTyre = tyreData.find((t) => t.id === id)
        return fetchWithMockFallback<Tyre | undefined>(
            API_CONFIG.ENDPOINTS.TYRES.GET_BY_ID(id),
            {},
            mockTyre
        )
    },
}
