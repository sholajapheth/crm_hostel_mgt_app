// Request interfaces
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  gender: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Response interfaces
export interface AuthResponse {
  user?: {
    id: string;
    email: string;
    name: string;
    gender?: string;
  };
  token?: string;
  message?: string;
}
