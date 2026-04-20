/**
 * Axios API client — pre-configured with base URL and auth interceptor.
 */
import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach JWT from localStorage ──
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("campusboard_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: handle 401 globally ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("campusboard_token");
      // Don't redirect here — let the auth context handle it
    }
    return Promise.reject(error);
  }
);

export default api;
