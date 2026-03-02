/**
 * Backend API Client (BFF - Backend for Frontend)
 * Replaces direct AzuraCast calls with backend proxy
 */

// Use relative URL for Docker (nginx proxy), fallback to localhost:3005 for dev
const API_BASE = import.meta.env.VITE_BACKEND_URL || '';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
  timestamp: string;
}

/**
 * Make HTTP request to backend API
 */
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE}/api${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add JWT token if provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`Backend API Error [${endpoint}]:`, {
        status: response.status,
        error: data.error,
      });

      return {
        success: false,
        error: data.error || { message: `HTTP ${response.status}` },
        timestamp: new Date().toISOString(),
      };
    }

    // Handle both response formats:
    // 1. Wrapped format: { success: true, data: {...} }
    // 2. Direct format: { success: true, products: [...], events: [...], etc. }
    const responseData = data.data !== undefined ? data.data : data;
    
    return {
      success: true,
      data: responseData as T,
      timestamp: data.timestamp || new Date().toISOString(),
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Backend API Error [${endpoint}]:`, errorMsg);

    return {
      success: false,
      error: { message: errorMsg },
      timestamp: new Date().toISOString(),
    };
  }
}

export { API_BASE };
