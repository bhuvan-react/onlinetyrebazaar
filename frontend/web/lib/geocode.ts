import { fetchWithMockFallback } from "./api-client";
import { mockPincodeResponse } from "./mock-data";

interface LocationDetails {
    district: string
    state: string
    city: string
    country: string
}

export async function fetchLocationDetails(pincode: string): Promise<LocationDetails | null> {
    try {
        const response = await fetchWithMockFallback<any>(
            `https://api.postalpincode.in/pincode/${pincode}`,
            {},
            mockPincodeResponse,
            true // Skip default headers
        );

        const data = response.data;

        if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice && data[0].PostOffice.length > 0) {
            const postOffice = data[0].PostOffice[0]
            return {
                district: postOffice.District,
                state: postOffice.State,
                city: postOffice.Name,
                country: postOffice.Country
            }
        }
        return null
    } catch (error) {
        console.error("Failed to fetch location details", error)
        return null
    }
}
