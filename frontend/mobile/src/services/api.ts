import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration
// Android Emulator : 'http://10.0.2.2:8081'
// iOS Simulator    : 'http://localhost:8081'
// Physical device  : 'http://<your-LAN-IP>:8081'
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.254.192.144:8081';

// Generic Fetch Wrapper
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`[API REQUEST] ${options.method || 'GET'} ${url}`);
    if (options.body) {
        console.log('[API BODY]', options.body);
    }

    const token = await AsyncStorage.getItem('userToken');
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };

    const response = await fetch(url, {
        headers,
        ...options,
    });

    console.log(`[API RESPONSE] Status: ${response.status}`);

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`[API ERROR] ${response.status} - ${errorText}`);
        throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('[API DATA]', data);
    return data as T;
}

// --- Auth ---

export const sendOtp = async (mobile: string) => {
    return apiFetch('/api/v1/auth/dealer/quick/send-otp', {
        method: 'POST',
        body: JSON.stringify({ mobile }),
    });
};

export const verifyOtp = async (mobile: string, otp: string) => {
    const response = await apiFetch<any>('/api/v1/auth/dealer/quick/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ mobile, otp }),
    });
    if (response.token) {
        await AsyncStorage.setItem('userToken', response.token);
    }
    return response;
};

export const loginWithPassword = async (identifier: string, password: string) => {
    const response = await apiFetch<any>('/api/v1/auth/dealer/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
    });
    if (response.token) {
        await AsyncStorage.setItem('userToken', response.token);
    }
    return response;
};

export const registerDealer = async (data: any) => {
    const response = await apiFetch<any>('/api/v1/auth/dealer/register/complete', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    if (response.token) {
        await AsyncStorage.setItem('userToken', response.token);
    }
    return response;
};

export const registerRoadsideDealer = async (data: any) => {
    const response = await apiFetch<any>('/api/v1/auth/dealer/register/complete', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    if (response.token) {
        await AsyncStorage.setItem('userToken', response.token);
    }
    return response;
};

export const logout = async () => {
    await AsyncStorage.removeItem('userToken');
};

// --- Profile ---

export const getProfile = async () => {
    return apiFetch('/api/v1/dealer/profile');
};

export const updateProfile = async (data: any) => {
    return apiFetch('/api/v1/dealer/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
    });
};

// --- Dashboard ---

export const getDashboardData = async () => {
    return apiFetch('/api/v1/dealer/dashboard');
};

// --- Leads ---

export const getLeads = async (filter?: string, sort?: string) => {
    const query = new URLSearchParams();

    if (filter && filter !== 'All') {
        // Map UI label → backend LeadStatus enum value
        const statusMap: Record<string, string> = {
            'New': 'NEW',
            'Follow-up': 'FOLLOW_UP',
            'Converted': 'CONVERTED',
        };
        query.append('status', statusMap[filter] || filter);
    }

    const sortMap: Record<string, string> = {
        'Date (Newest)': 'date_desc',
        'Date (Oldest)': 'date_asc',
        'Priority': 'priority',
    };
    query.append('sort', sort ? (sortMap[sort] || 'date_desc') : 'date_desc');
    query.append('page', '0');
    query.append('size', '10');

    return apiFetch(`/api/v1/leads?${query.toString()}`);
};

export const getUnlockedLeads = async (page = 0, size = 10) => {
    return apiFetch(`/api/v1/leads/unlocked?page=${page}&size=${size}`);
};

export const getLeadDetails = async (leadId: string) => {
    return apiFetch(`/api/v1/leads/${leadId}`);
};

export const submitOffer = async (leadId: string, offerDetails: any) => {
    return apiFetch(`/api/v1/leads/${leadId}/offer`, {
        method: 'POST',
        body: JSON.stringify(offerDetails),
    });
};

export const skipLead = async (leadId: string) => {
    return apiFetch(`/api/v1/leads/${leadId}/status?status=SKIPPED`, { method: 'PUT' });
};

// --- Wallet ---

export const getWalletData = async () => {
    return apiFetch('/api/v1/dealer/wallet');
};

export const getPackages = async () => {
    return apiFetch('/api/v1/dealer/packages');
};

export const rechargeWallet = async (packageId: string) => {
    return apiFetch('/api/v1/dealer/wallet/testRecharge', {
        method: 'POST',
        body: JSON.stringify({ packageId }),
    });
};

// --- Stats ---
// Backend has no dedicated stats endpoint; dashboard contains the same data
export const getStatsData = async () => {
    return apiFetch('/api/v1/dealer/dashboard');
};

// --- Notification Settings ---
// Backend endpoint not yet implemented; throws so callers can show appropriate UI
export const getNotificationSettings = async () => {
    return apiFetch('/api/v1/dealer/settings/notifications');
};
