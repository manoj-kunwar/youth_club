import axios, { AxiosError, type AxiosResponse } from 'axios';
import { getSupabaseBrowserClient } from './supabase';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

// ─── Axios Instance ───────────────────────────────────────────────────────
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor: Attach Supabase JWT ─────────────────────────────
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const supabase = getSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.access_token) {
        config.headers['Authorization'] = `Bearer ${session.access_token}`;
      }
    } catch {
      // If auth fails, proceed unauthenticated (public routes will work)
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Normalize Errors ───────────────────────────────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<{ error?: { code?: string; message?: string; details?: any } }>) => {
    let message = error.response?.data?.error?.message;
    const details = error.response?.data?.error?.details;
    const code = error.response?.data?.error?.code || 'UNKNOWN_ERROR';
    const statusCode = error.response?.status || 0;

    if (!message) {
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        message = `Cannot connect to API server (${API_BASE_URL}). Please verify the backend is running.`;
      } else if (statusCode === 401) {
        message = 'Authentication required. Please sign in to perform this action.';
      } else if (statusCode === 403) {
        message = 'Permission denied. You do not have access to perform this action.';
      } else if (statusCode === 404) {
        message = 'Requested API resource was not found.';
      } else if (statusCode === 409) {
        message = 'A resource with this title or slug already exists.';
      } else if (statusCode >= 500) {
        message = 'Backend server error. Please try again later.';
      } else {
        message = error.message || 'An unexpected error occurred';
      }
    }

    const customError = new Error(message);
    return Promise.reject(
      Object.assign(customError, { code, statusCode, details })
    );
  }
);

// ─── Helper: Extract data from API responses ──────────────────────────────
export async function fetchApi<T>(
  endpoint: string,
  options?: Parameters<typeof apiClient.get>[1]
): Promise<T> {
  const response = await apiClient.get<{ success: boolean; data: T }>(endpoint, options);
  return response.data.data;
}

export async function postApi<T, D = unknown>(
  endpoint: string,
  data?: D,
  options?: Parameters<typeof apiClient.post>[2]
): Promise<T> {
  const response = await apiClient.post<{ success: boolean; data: T }>(endpoint, data, options);
  return response.data.data;
}

export async function patchApi<T, D = unknown>(
  endpoint: string,
  data?: D
): Promise<T> {
  const response = await apiClient.patch<{ success: boolean; data: T }>(endpoint, data);
  return response.data.data;
}

export async function deleteApi<T>(endpoint: string): Promise<T> {
  const response = await apiClient.delete<{ success: boolean; data: T }>(endpoint);
  return response.data.data;
}
