import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { httpClient } from "./httpClient";
import type { RegisterRequest, LoginRequest, AuthResponse } from "./interface";
import { useAuthStore } from "../../stores/authStore";
import { toast } from "sonner";

// Register mutation
export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: async (data: RegisterRequest) => {
      const response = await httpClient.post<AuthResponse>(
        "/api/v2/admin/auth/register",
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.user) {
        // Store user and token after successful registration
        useAuthStore.getState().setUser(data.user);
        if (data.token) {
          useAuthStore.getState().setToken(data.token);
        }
        useAuthStore.getState().setAuthenticated(true);
        toast.success("Registration successful! Welcome!");
        navigate("/dashboard", { replace: true });
      } else {
        toast.success(data.message || "Registration successful!");
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";
      toast.error(errorMessage);
    },
  });
};

// Login mutation
export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: async (data: LoginRequest) => {
      const response = await httpClient.post<AuthResponse>(
        "/api/v2/admin/auth/login",
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Store user and token from login response
      if (data.user) {
        useAuthStore.getState().setUser(data.user);
      }
      if (data.token) {
        useAuthStore.getState().setToken(data.token);
      }
      useAuthStore.getState().setAuthenticated(true);
      toast.success("Login successful!");
      // Navigate to dashboard on successful login
      navigate("/dashboard", { replace: true });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please check your credentials.";
      toast.error(errorMessage);
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const navigate = useNavigate();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await httpClient.post("/api/v2/admin/auth/logout");
    },
    onSuccess: () => {
      // Clear auth state
      useAuthStore.getState().clearAuth();
      toast.success("Logged out successfully");
      // Navigate to login page
      navigate("/", { replace: true });
    },
    onError: (error: any) => {
      // Even if logout fails on server, clear local auth state
      useAuthStore.getState().clearAuth();
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Logout failed, but you have been logged out locally.";
      toast.error(errorMessage);
      navigate("/", { replace: true });
    },
  });
};
