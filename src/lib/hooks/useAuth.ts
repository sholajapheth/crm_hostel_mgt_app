import { useAuthStore } from "../stores/authStore";
import { useLogin, useRegister, useLogout } from "../api/auth/mutations";
import type { LoginRequest, RegisterRequest } from "../api/auth/interface";

export const useAuth = () => {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  const login = async (credentials: LoginRequest) => {
    await loginMutation.mutateAsync(credentials);
  };

  const register = async (data: RegisterRequest) => {
    await registerMutation.mutateAsync(data);
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  return {
    isAuthenticated,
    user,
    isLoading:
      isLoading ||
      loginMutation.isPending ||
      registerMutation.isPending ||
      logoutMutation.isPending,
    login,
    register,
    logout: handleLogout,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    logoutError: logoutMutation.error,
  };
};
