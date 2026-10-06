import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/store/auth-store";
import type { ApiSuccess } from "@/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://dev-assesment-backend.onrender.com/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30_000,
});

// Attach the access token to every request.
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function onRefreshed(token: string) {
  pendingQueue.forEach((p) => p.resolve(token));
  pendingQueue = [];
}

function onRefreshFailed(err: unknown) {
  pendingQueue.forEach((p) => p.reject(err));
  pendingQueue = [];
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) throw new Error("No refresh token");
  // Use a bare axios call so we don't recurse through the interceptor.
  const res = await axios.post<{ data: { accessToken: string } }>(
    `${BASE_URL}/auth/refresh-token`,
    { refreshToken },
    { headers: { "Content-Type": "application/json" } },
  );
  const accessToken = res.data.data.accessToken;
  useAuthStore.getState().setAccessToken(accessToken);
  return accessToken;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const status = error.response?.status;
    const url = originalRequest?.url ?? "";

    // Don't try to refresh on the auth endpoints themselves.
    const isAuthRoute =
      url.includes("/auth/login") ||
      url.includes("/auth/refresh-token") ||
      url.includes("/auth/register");

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        // Wait for the in-flight refresh, then retry this request.
        return new Promise((resolve, reject) => {
          pendingQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        onRefreshed(newToken);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch (refreshErr) {
        onRefreshFailed(refreshErr);
        useAuthStore.getState().clear();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// Convenience wrapper that returns the typed `data` payload and unwraps errors.
export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const res = await api.request<ApiSuccess<T>>(config);
  return res.data.data;
}

export { BASE_URL };
