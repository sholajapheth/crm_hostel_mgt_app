import { useMutation } from "@tanstack/react-query";
import { httpClient } from "./httpClient";
import type { RegisterRequest, LoginRequest, AuthResponse } from "./interface";

// Register mutation
export const useRegister = () => {
  return useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: async (data: RegisterRequest) => {
      const response = await httpClient.post<AuthResponse>(
        "/api/v3/admin/auth/register",
        data
      );
      return response.data;
    },
  });
};

// Login mutation
export const useLogin = () => {
  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: async (data: LoginRequest) => {
      const response = await httpClient.post<AuthResponse>(
        "/api/v3/admin/auth/login",
        data
      );
      return response.data;
    },
  });
};

