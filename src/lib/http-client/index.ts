import axios from "axios";

export function createHttpClient() {
  const client = axios.create({
    baseURL: "/api/proxy",
    headers: { "Content-Type": "application/json" },
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
      console.error("HTTP Response Error:", {
        message: error.message,
        status: error.response?.status,
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
