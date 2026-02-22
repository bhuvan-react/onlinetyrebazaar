export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
    id: string;
    tyreId?: string; // Optional as backend might not always populate
    tyreName: string; // Renamed from name
    unitPrice: number; // Renamed from price
    quantity: number;
    // UI specific fields (might need mapping or separate type)
    image?: string;
    variant?: string;
}

export interface Address {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
}

export interface Order {
    id: string;
    description?: string; // Added to match some usages or remove if unused, but backend has no description
    // Backend fields
    orderNumber: string;
    orderDate: string; // ISO date string
    status: OrderStatus;
    totalAmount: number; // Renamed from total
    items: OrderItem[];
    // Frontend specific or missing in backend (marked optional)
    date?: string; // derived from orderDate
    total?: number; // derived from totalAmount
    shippingAddress?: Address;
    paymentMethod?: string;
}
