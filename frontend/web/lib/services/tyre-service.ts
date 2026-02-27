import { fetchWithMockFallback } from "../api-client"
import { API_CONFIG } from "../api-config"
import { tyreData, type Tyre } from "../tyre-data"

export interface TyreFilters {
    size?: string
    brand?: string
    pattern?: string
    categoryId?: string
}

// Map raw backend response (snake_case/camelCase from Spring) to frontend Tyre interface
function getFallbackImage(brand: string, type?: string): string {
    const b = brand.toLowerCase()
    
    // Check if we have a specific used tyre image
    if (type === "used" && ["apollo", "ceat", "mrf"].includes(b)) {
        return `/used-${b}-tyre.jpg`
    }
    
    // Check if we have a specific brand tyre image
    if (["apollo", "bridgestone", "ceat", "goodyear", "jk tyre", "mrf", "yokohama"].includes(b)) {
        const brandSlug = b.replace(/\s+/g, '-')
        return `/${brandSlug}-car-tyre.jpg`
    }
    
    // Default generic tyre image
    return "/car-tyre-new.jpg"
}

function mapBackendTyre(raw: any): Tyre {
    const fallbackImage = getFallbackImage(raw.brand || "", raw.type)
    
    return {
        id: String(raw.id),
        brand: raw.brand,
        pattern: raw.pattern,
        model: raw.pattern,            // alias: TyreCard reads `model`
        size: raw.size,
        price: raw.price,
        image: raw.imageUrl || fallbackImage,     // TyreCard reads `image`
        imageUrl: raw.imageUrl || fallbackImage,
        features: Array.isArray(raw.features)
            ? raw.features
            : typeof raw.features === "string"
                ? raw.features.split(",").map((f: string) => f.trim()).filter(Boolean)
                : [],
        type: raw.type as "new" | "used" | undefined,
        newPrice: raw.newPrice,
        usedPrice: raw.usedPrice,
        originalPrice: raw.originalPrice,
        rating: raw.rating,
        reviewCount: raw.reviewCount,
        inStock: raw.inStock !== undefined ? raw.inStock : true,
        condition: raw.condition,
        treadDepth: raw.treadDepth,
        freeInstallation: raw.freeInstallation !== undefined ? raw.freeInstallation : true,
        productCode: raw.productCode,
        warrantyYears: raw.warrantyYears,
    }
}

export const tyreService = {
    getAllTyres: async (filters?: TyreFilters): Promise<{ data: Tyre[]; status: number }> => {
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

        const response = await fetchWithMockFallback<any[]>(endpoint, {}, tyreData)

        // If we got real data from the backend (array of raw objects), map them
        if (Array.isArray(response.data) && response.data.length > 0 && response.data[0]?.id) {
            // Check if it looks like backend data (has imageUrl but no `image` field set)
            const first = response.data[0]
            const isBackendData = first.imageUrl !== undefined && first.image === undefined
            if (isBackendData) {
                return {
                    ...response,
                    data: response.data.map(mapBackendTyre),
                }
            }
        }

        return response as { data: Tyre[]; status: number }
    },

    getTyreById: async (id: string): Promise<{ data: Tyre | undefined; status: number }> => {
        const mockTyre = tyreData.find((t) => t.id === id)
        const response = await fetchWithMockFallback<any>(
            API_CONFIG.ENDPOINTS.TYRES.GET_BY_ID(id),
            {},
            mockTyre
        )

        if (response.data && response.data.imageUrl !== undefined && response.data.image === undefined) {
            return {
                ...response,
                data: mapBackendTyre(response.data),
            }
        }

        return response as { data: Tyre | undefined; status: number }
    },
}
