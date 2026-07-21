import api from "../api/axios";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
}

export const login = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/api/Auth/login",
    data
  );

  return response.data;
};

export const register = async (
  data: RegisterRequest
) => {
  const response = await api.post(
    "/api/Auth/register",
    data
  );

  return response.data;
};