import { fetchWithMockFallback } from "../api-client"
import { API_CONFIG } from "../api-config"

export interface Vehicle {
    id: string
    vehicleName: string
    registrationNumber: string
    tyreSize: string
    isPrimary: boolean
    make?: string
    model?: string
    variant?: string
}

export const vehicleService = {
    getVehicles: async () => {
        return fetchWithMockFallback<Vehicle[]>(API_CONFIG.ENDPOINTS.VEHICLES.GET_ALL, {})
    },

    addVehicle: async (vehicle: Omit<Vehicle, "id">) => {
        return fetchWithMockFallback<Vehicle>(
            API_CONFIG.ENDPOINTS.VEHICLES.ADD,
            {
                method: "POST",
                body: JSON.stringify(vehicle),
            }
        )
    },

    deleteVehicle: async (id: string) => {
        return fetchWithMockFallback<{ success: boolean }>(
            API_CONFIG.ENDPOINTS.VEHICLES.DELETE(id),
            { method: "DELETE" }
        )
    },

    getMakes: async (type: string) => {
        return fetchWithMockFallback<{ makes: string[] }>(
            `${API_CONFIG.ENDPOINTS.VEHICLES.MAKES}?type=${type}`,
            {}
        )
    },

    getModels: async (type: string, make: string) => {
        return fetchWithMockFallback<{ models: string[] }>(
            `${API_CONFIG.ENDPOINTS.VEHICLES.MODELS}?type=${type}&make=${make}`,
            {}
        )
    },

    getVariants: async (type: string, make: string, model: string) => {
        return fetchWithMockFallback<{ variants: string[] }>(
            `${API_CONFIG.ENDPOINTS.VEHICLES.VARIANTS}?type=${type}&make=${make}&model=${model}`,
            {}
        )
    },

    getTyreSizes: async (make: string, model: string, variant: string) => {
        return fetchWithMockFallback<{ sizes: string[] }>(
            `/vehicles/tyre-sizes?make=${make}&model=${model}&variant=${variant}`,
            {}
        )
    }
}
