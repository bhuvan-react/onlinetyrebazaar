import { Order } from "@/types/order";


export const mockRequests = [
    {
        id: "TYR12345",
        tyreName: "MRF ZVTS 185/65 R15",
        vehicle: "Maruti Swift VXi",
        quotesReceived: 5,
        bestQuote: 4299,
        requestedAt: "2 hours ago",
        status: "Active"
    },
    {
        id: "TYR12346",
        tyreName: "Apollo Alnac 4G 195/55 R16",
        vehicle: "Hyundai i20 Asta",
        quotesReceived: 3,
        bestQuote: 5100,
        requestedAt: "1 day ago",
        status: "Active"
    },
    {
        id: "TYR12347",
        tyreName: "Bridgestone B290 165/80 R14",
        vehicle: "Maruti Swift Dzire",
        quotesReceived: 8,
        bestQuote: 3850,
        requestedAt: "3 days ago",
        status: "Completed"
    }
];

export const mockVehicles = [
    {
        id: "VEH-001",
        vehicleName: "Maruti Swift VXi",
        make: "Maruti",
        model: "Swift",
        variant: "VXi",
        registrationNumber: "MH 02 AB 1234",
        tyreSize: "185/65 R15",
        isPrimary: true,
    },
    {
        id: "VEH-002",
        vehicleName: "Honda City ZX",
        make: "Honda",
        model: "City",
        variant: "ZX",
        registrationNumber: "MH 12 CD 5678",
        tyreSize: "175/65 R14",
        isPrimary: false,
    }
];

// Mock Pincode Response
export const mockPincodeResponse = [
    {
        Message: "Number of pincode(s) found: 1",
        Status: "Success",
        PostOffice: [
            {
                Name: "Indiranagar",
                Description: null,
                BranchType: "Sub Post Office",
                DeliveryStatus: "Delivery",
                Circle: "Karnataka",
                District: "Bangalore",
                Division: "Bangalore East",
                Region: "Bangalore HQ",
                Block: "Bangalore North",
                State: "Karnataka",
                Country: "India",
                Pincode: "560038"
            }
        ]
    }
];
