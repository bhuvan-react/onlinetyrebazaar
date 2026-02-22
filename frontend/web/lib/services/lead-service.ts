import { apiClient } from "../api-client"
import { API_CONFIG } from "../api-config"

// Matches backend LeadDetailsResponse record exactly
export interface Lead {
    id: string
    vehicleType: string
    tyreType: string
    tyreBrand: string
    vehicleModel: string | null
    locationArea: string
    locationPincode: string
    status: string           // LeadStatus: NEW | VERIFIED | FOLLOW_UP | CONVERTED | REJECTED | DUPLICATE | OFFER_RECEIVED | DEALER_SELECTED | CLOSED
    customerMobile: string | null   // only visible to the selected dealer
    selectedDealerId: string | null
    createdAt: string
    verifiedAt: string | null
}

// Matches backend LeadRequest record exactly
export interface LeadRequest {
    vehicleType: string        // required (@NotBlank)
    tyreType: string           // required (@NotBlank)
    tyreBrand: string          // required (@NotBlank)
    vehicleModel?: string      // optional
    locationArea: string       // required (@NotBlank)
    locationPincode: string    // required, exactly 6 digits
}

export const leadService = {
    createLead: async (data: LeadRequest) => {
        return apiClient.post<Lead>(API_CONFIG.ENDPOINTS.CUSTOMER_LEADS.CREATE, data)
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
    }
}
