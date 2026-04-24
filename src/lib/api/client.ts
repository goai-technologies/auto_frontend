import { toast } from "@/hooks/use-toast";
import type { ApiEnvelope, ApiErrorEnvelope, ApiSuccess } from "./types";
import { getRuntimeEnv } from "../runtime-config";

const API_BASE = getRuntimeEnv("VITE_API_BASE_URL") ?? import.meta.env.VITE_API_BASE_URL ?? "/api/v1";
const TOKEN_KEY = "goai_token";
export const AUTH_TOKEN_EVENT = "goai-auth-token-changed";
const AUTH_REDIRECT_FLAG = "goai_auth_redirecting";

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function getAuthToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string | null) {
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }
  window.dispatchEvent(new Event(AUTH_TOKEN_EVENT));
}

function isEnvelope<T>(value: unknown): value is ApiEnvelope<T> {
  if (!value || typeof value !== "object") return false;
  return "data" in value || "error" in value;
}

function getErrorMessage(raw: any, status: number) {
  const fallbackByStatus: Record<number, string> = {
    400: "Invalid request payload.",
    401: "Session expired. Please sign in again.",
    403: "Insufficient permissions for this action.",
    404: "Requested resource was not found.",
    409: "Request conflicts with current resource state.",
    410: "Requested API route is deprecated.",
    500: "Server error. Please try again.",
  };
  return (
    raw?.error?.message ||
    (typeof raw?.message === "string" ? raw.message : undefined) ||
    (typeof raw?.detail === "string" ? raw.detail : undefined) ||
    fallbackByStatus[status] ||
    `Request failed with status ${status}`
  );
}

function handleUnauthorized(path: string) {
  const isAuthRoute = path.startsWith("/auth/login") || path.startsWith("/auth/register");
  if (isAuthRoute) return;
  setAuthToken(null);
  const publicPaths = new Set(["/landing", "/login", "/register", "/onboarding"]);
  const isOnPublicPage = publicPaths.has(window.location.pathname);
  const alreadyRedirecting = window.sessionStorage.getItem(AUTH_REDIRECT_FLAG) === "1";
  if (!isOnPublicPage && !alreadyRedirecting) {
    window.sessionStorage.setItem(AUTH_REDIRECT_FLAG, "1");
    toast({
      title: "Session expired",
      description: "Please sign in again.",
    });
    window.location.replace("/login");
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const incomingHeaders = new Headers(options.headers);
  incomingHeaders.forEach((value, key) => {
    headers[key] = value;
  });
  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const targetUrl = path === "/health" || path === "/ready" ? path : `${API_BASE}${path}`;
  const res = await fetch(targetUrl, { ...options, headers });
  if (res.status === 204) return undefined as T;

  const rawJson = await res.json().catch(() => ({}));
  const parsed = isEnvelope<T>(rawJson) ? rawJson : ({ data: rawJson } as ApiEnvelope<T>);

  if (!res.ok) {
    if (res.status === 401) handleUnauthorized(path);
    throw new ApiError(getErrorMessage(rawJson, res.status), res.status, (rawJson as any)?.error?.code);
  }
  if (!("data" in parsed) || parsed.data === undefined) {
    throw new ApiError("Malformed response from server", res.status);
  }
  return parsed.data;
}

export function unwrapData<T>(resp: ApiSuccess<T> | ApiErrorEnvelope): T {
  if ("error" in resp) throw new ApiError(resp.error.message, 400, resp.error.code);
  return resp.data;
}
