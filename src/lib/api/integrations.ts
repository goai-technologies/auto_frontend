import { apiRequest } from "./client";
import type { IntegrationItem, PaginationMeta } from "./types";

export interface IntegrationsListParams {
  page?: number;
  page_size?: number;
  provider?: "github" | "jira" | "linear";
  is_active?: boolean;
}

export interface IntegrationsListResponse {
  items: IntegrationItem[];
  pagination: PaginationMeta;
}

export function listIntegrations(params: IntegrationsListParams = {}) {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.page_size) search.set("page_size", String(params.page_size));
  if (params.provider) search.set("provider", params.provider);
  if (typeof params.is_active === "boolean") search.set("is_active", String(params.is_active));
  const qs = search.toString();
  return apiRequest<IntegrationsListResponse>(`/integrations${qs ? `?${qs}` : ""}`);
}

export function connectGithub(body: { installation_id: string; org: string }) {
  return apiRequest<IntegrationItem>("/integrations/github/connect", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function connectJira(body: { base_url: string; email_or_user: string; api_token: string; project_keys?: string[] }) {
  return apiRequest<IntegrationItem>("/integrations/jira/connect", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function connectLinear(body: { api_key: string }) {
  return apiRequest<IntegrationItem>("/integrations/linear/connect", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
