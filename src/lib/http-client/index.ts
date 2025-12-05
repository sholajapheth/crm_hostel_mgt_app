import axios from "axios";
import { useAuthStore } from "../stores/authStore";

const apiUrl = import.meta.env.VITE_API_URL;

export function createHttpClient() {
  const client = axios.create({
    baseURL: apiUrl,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  client.interceptors.request.use((config) => {
    // Get token from auth store
    const token = useAuthStore.getState().token;

    // Add Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("HTTP Request:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
      baseURL: config.baseURL,
    });
    return config;
  });

  client.interceptors.response.use(
    (response) => {
      console.log("HTTP Response:", {
        status: response.status,
        data: response.data,
        url: response.config.url,
      });
      return response;
    },
    (error) => {
      const status = error.response?.status;

      // if (status === 401 || status === 403) {
      //   useAuthStore.getState().clearAuth();

      //   if (typeof window !== "undefined" && window.location.pathname !== "/") {
      //     window.location.href = "/";
      //   }
      // }

      console.error("HTTP Response Error:", {
        message: error.message,
        status: status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        headers: error.response?.headers,
      });
      return Promise.reject(error);
    }
  );

  return client;
}
