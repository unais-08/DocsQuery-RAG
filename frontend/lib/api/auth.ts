import { apiRequest } from "@/lib/api/client";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  user: AuthUser;
  token: string;
};

const AuthAPIPrefix = '/api/v1/auth'

export async function loginUser(input: LoginInput): Promise<AuthResponse> {
  return apiRequest<AuthResponse>(`${AuthAPIPrefix}/login`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function registerUser(input: RegisterInput): Promise<AuthResponse> {
  return apiRequest<AuthResponse>(`${AuthAPIPrefix}/register`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getCurrentUser(token: string): Promise<AuthUser> {
  const response = await apiRequest<{ user: AuthUser }>(`${AuthAPIPrefix}/me`, {
    method: "GET",
  }, token);

  return response.user;
}

export async function logoutUser(): Promise<void> {
  return undefined;
}
