import { apiClient } from "../api-client"
import { API_CONFIG } from "../api-config"

export interface FilterConfig {
  id: string
  filterType: string
  label: string
  minValue: number
  maxValue: number | null
  sortOrder: number
}

export const filterService = {
  getPriceRanges: async () => {
    try {
      const response = await apiClient.get<FilterConfig[]>(API_CONFIG.ENDPOINTS.FILTERS.PRICE_RANGES)
      return response.data || []
    } catch (error) {
      console.error("Error fetching price ranges:", error)
      return []
    }
  },

  getRatings: async () => {
    try {
      const response = await apiClient.get<FilterConfig[]>(API_CONFIG.ENDPOINTS.FILTERS.RATINGS)
      return response.data || []
    } catch (error) {
      console.error("Error fetching ratings:", error)
      return []
    }
  },

  getBrands: async () => {
    try {
      const response = await apiClient.get<{ brands: string[] }>(API_CONFIG.ENDPOINTS.FILTERS.BRANDS)
      return response.data?.brands || []
    } catch (error) {
      console.error("Error fetching brands:", error)
      return []
    }
  },

  getSizes: async () => {
    try {
      const response = await apiClient.get<{ sizes: string[] }>(API_CONFIG.ENDPOINTS.FILTERS.SIZES)
      return response.data?.sizes || []
    } catch (error) {
      console.error("Error fetching sizes:", error)
      return []
    }
  }
}
