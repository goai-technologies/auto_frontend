import { apiRequest } from "./client";
import type { IntegrationItem, PaginationMeta } from "./types";

export interface IntegrationsListParams {
  page?: number;
  page_size?: number;
  provider?: string;
  is_active?: boolean;
  q?: string;
}

export interface IntegrationsListResponse {
  items: IntegrationItem[];
  pagination: PaginationMeta;
}

export interface IntegrationProvidersResponse {
  providers: string[];
}

export interface ConnectIntegrationPayload {
  provider: string;
  name?: string;
  config?: Record<string, unknown>;
  secrets?: Record<string, unknown>;
}

export function listIntegrations(params: IntegrationsListParams = {}) {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.page_size) search.set("page_size", String(params.page_size));
  if (params.provider) search.set("provider", params.provider);
  if (typeof params.is_active === "boolean") search.set("is_active", String(params.is_active));
  if (params.q) search.set("q", params.q);
  const qs = search.toString();
  return apiRequest<IntegrationsListResponse>(`/integrations${qs ? `?${qs}` : ""}`);
}

export function listIntegrationProviders() {
  return apiRequest<IntegrationProvidersResponse>("/integrations/providers");
}

export function connectIntegration(body: ConnectIntegrationPayload) {
  return apiRequest<IntegrationItem>("/integrations/connect", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
