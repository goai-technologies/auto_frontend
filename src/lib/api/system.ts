import { apiRequest } from "./client";
import type { HealthStatusResponse } from "./types";

export function getHealth() {
  return apiRequest<HealthStatusResponse>("/health");
}

export function getReadiness() {
  return apiRequest<HealthStatusResponse>("/ready");
}

export function getSystemHealth() {
  return apiRequest<HealthStatusResponse>("/system/health");
}
