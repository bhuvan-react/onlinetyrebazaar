import { apiClient } from "../api-client"
import { API_CONFIG } from "../api-config"

// Matches backend LeadDetailsResponse record exactly
export interface Lead {
    id: string
    vehicleType: string
    tyreType: string
    tyreBrand: string
    vehicleModel: string | null
    vehicleYear: string | null
    locationArea: string
    locationPincode: string
    tyreSize: string | null
    status: string           // LeadStatus: NEW | VERIFIED | FOLLOW_UP | CONVERTED | REJECTED | DUPLICATE | OFFER_RECEIVED | DEALER_SELECTED | CLOSED
    customerMobile: string | null   // only visible to the selected dealer
    selectedDealerId: string | null
    createdAt: string
    verifiedAt: string | null
}

// Matches backend DealerPurchaserResponse record exactly
export interface DealerPurchaser {
    dealerId: string
    businessName: string
    ownerName: string
    phone: string
    email: string
    zipCode: string
    city: string
    purchasedAt: string
}

// Matches backend LeadRequest record exactly
export interface LeadRequest {
    vehicleType: string        // required (@NotBlank)
    tyreType: string           // required (@NotBlank)
    tyreBrand: string          // required (@NotBlank)
    vehicleModel?: string      // optional
    vehicleYear?: string       // optional
    locationArea: string       // required (@NotBlank)
    locationPincode: string    // required, exactly 6 digits
    tyreSize?: string
    tyrePosition?: string
    urgency?: string
    issues?: string[]
    usageType?: string
    budget?: string
    preferences?: string[]
    serviceRequirement?: string
    quantity?: number
    tyreId?: string | null
}

export const leadService = {
    createLead: async (data: LeadRequest) => {
        return apiClient.post<Lead>(API_CONFIG.ENDPOINTS.CUSTOMER_LEADS.CREATE, data)
    },

    selectTyreForLead: async (leadId: string, tyreId: string, tyreType: string = "NEW") => {
        return apiClient.put<Lead>(`${API_CONFIG.ENDPOINTS.CUSTOMER_LEADS.CREATE}/${leadId}/tyre/${tyreId}?tyreType=${tyreType.toUpperCase()}`)
    },

    // Eagerly update just the tyreType when the customer picks New/Used on the tyre card
    // Called as soon as the quote page loads — before "Confirm Lead" is clicked
    patchTyreType: async (leadId: string, tyreType: string) => {
        return apiClient.put<Lead>(`${API_CONFIG.ENDPOINTS.CUSTOMER_LEADS.CREATE}/${leadId}/type?tyreType=${tyreType.toUpperCase()}`)
    },

    // Backend returns Lead[] (bare array, not wrapped in { leads: [...] })
    getCustomerLeads: async () => {
        return apiClient.get<Lead[]>(API_CONFIG.ENDPOINTS.CUSTOMER_LEADS.GET_ALL)
    },

    // Backend returns OfferResponse[] (bare array, not wrapped in { offers: [...] })
    getLeadOffers: async (id: string) => {
        return apiClient.get<any[]>(API_CONFIG.ENDPOINTS.CUSTOMER_LEADS.GET_OFFERS(id))
    },

    selectOffer: async (leadId: string, dealerId: string) => {
        return apiClient.post(API_CONFIG.ENDPOINTS.CUSTOMER_LEADS.SELECT_OFFER(leadId, dealerId))
    },

    // Returns all dealers who purchased/unlocked this lead (from lead_purchases table)
    getLeadPurchasers: async (leadId: string) => {
        return apiClient.get<DealerPurchaser[]>(API_CONFIG.ENDPOINTS.CUSTOMER_LEADS.GET_PURCHASERS(leadId))
    },
}
