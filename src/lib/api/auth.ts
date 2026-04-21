import { apiRequest, setAuthToken } from "./client";
import type { AuthResponse, AuthTenant, AuthUser } from "./types";

export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setAuthToken(data.access_token);
  window.sessionStorage.removeItem("goai_auth_redirecting");
  return data;
}

export async function register(payload: {
  name: string;
  org_name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setAuthToken(data.access_token);
  window.sessionStorage.removeItem("goai_auth_redirecting");
  return data;
}

export async function getMe(): Promise<{ user: AuthUser; tenant: AuthTenant }> {
  return apiRequest<{ user: AuthUser; tenant: AuthTenant }>("/auth/me");
}
