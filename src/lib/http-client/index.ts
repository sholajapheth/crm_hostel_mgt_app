import axios from "axios";
import { useAuthStore } from "../stores/authStore";

export function createHttpClient() {
  const client = axios.create({
    baseURL: "https://crm-registration-system.onrender.com",
    headers: { "Content-Type": "application/json", credentials: "include" },
  });

  client.interceptors.request.use((config) => {
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

      // Handle 401/403 - unauthorized/forbidden
      if (status === 401 || status === 403) {
        // Clear auth state
        useAuthStore.getState().clearAuth();

        // Only redirect if we're not already on the login page
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      }

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
