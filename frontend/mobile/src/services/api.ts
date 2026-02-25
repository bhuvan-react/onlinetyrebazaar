import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Configuration
// Android Emulator : 'http://10.0.2.2:8081'
// iOS Simulator    : 'http://localhost:8081'
// Physical device  : 'http://<your-LAN-IP>:8081'
const getBaseUrl = () => {
    if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
    
    // Default fallback for development
    // Using LAN IP 192.168.1.4 for physical iPhone/Android devices
    return 'http://192.168.1.4:8081';
};

const API_BASE_URL = getBaseUrl();

// Generic Fetch Wrapper
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`[API REQUEST] ${options.method || 'GET'} ${url}`);

    let token = await AsyncStorage.getItem('userToken');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };

    let response = await fetch(url, {
        headers,
        ...options,
    });

    console.log(`[API RESPONSE] Status: ${response.status}`);

    // Handle 401 Unauthorized - Attempt Token Refresh
    if (response.status === 401 && !endpoint.includes('/refresh')) {
        const refreshToken = await AsyncStorage.getItem('userRefreshToken');
        if (refreshToken) {
            try {
                console.log('[API] Attempting token refresh...');
                const refreshResponse = await fetch(`${API_BASE_URL}/api/v1/auth/dealer/refresh`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Refresh-Token': refreshToken
                    }
                });

                if (refreshResponse.ok) {
                    const data = await refreshResponse.json();
                    const newToken = data.token;
                    await AsyncStorage.setItem('userToken', newToken);
                    
                    // Retry original request
                    headers['Authorization'] = `Bearer ${newToken}`;
                    response = await fetch(url, {
                        headers,
                        ...options,
                    });
                    console.log(`[API RETRY] Status: ${response.status}`);
                } else {
                    console.warn('[API] Refresh failed, logging out');
                    await logout();
                    // Optional: navigation reset logic could be triggered here
                }
            } catch (err) {
                console.error('[API] Refresh error', err);
            }
        }
    }

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

/**
 * Send OTP for Quick Login (Existing Users)
 */
export const sendQuickOtp = async (mobile: string) => {
    return apiFetch('/api/v1/auth/dealer/quick/send-otp', {
        method: 'POST',
        body: JSON.stringify({ mobile }),
    });
};

/**
 * Send OTP for New Business Registration
 */
export const sendRegisterOtp = async (mobile: string) => {
    return apiFetch('/api/v1/auth/dealer/register/send-otp', {
        method: 'POST',
        body: JSON.stringify({ mobile }),
    });
};

// Keep existing sendOtp for compatibility
export const sendOtp = sendQuickOtp;

export const verifyOtp = async (mobile: string, otp: string) => {
    const response = await apiFetch<any>('/api/v1/auth/dealer/quick/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ mobile, otp }),
    });
    if (response.token) {
        await AsyncStorage.setItem('userToken', response.token);
        if (response.refreshToken) {
            await AsyncStorage.setItem('userRefreshToken', response.refreshToken);
        }
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
        if (response.refreshToken) {
            await AsyncStorage.setItem('userRefreshToken', response.refreshToken);
        }
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
        if (response.refreshToken) {
            await AsyncStorage.setItem('userRefreshToken', response.refreshToken);
        }
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
        if (response.refreshToken) {
            await AsyncStorage.setItem('userRefreshToken', response.refreshToken);
        }
    }
    return response;
};

export const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userRefreshToken');
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

export const markLeadAsConverted = async (leadId: string) => {
    return apiFetch(`/api/v1/leads/${leadId}/replace-tyre`, { method: 'PUT' });
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
