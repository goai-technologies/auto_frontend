export type ApiEnvelope<T> =
  | {
      data: T;
      error?: never;
    }
  | {
      data?: never;
      error: {
        message: string;
        code?: string;
      };
    };

export type ApiSuccess<T> = { data: T };
export type ApiErrorEnvelope = { error: { message: string; code?: string } };

export function unwrapData<T>(resp: ApiSuccess<T> | ApiErrorEnvelope): T {
  if ("error" in resp) throw new Error(resp.error.message);
  return resp.data;
}

export interface PaginationMeta {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

export type Paginated<T> = {
  items: T[];
  pagination: PaginationMeta;
};

export function isPaginated<T>(val: unknown): val is Paginated<T> {
  return !!val && typeof val === "object" && Array.isArray((val as any).items) && !!(val as any).pagination;
}

export function getItems<T>(data: T[] | { items: T[] }): T[] {
  return Array.isArray(data) ? data : data.items;
}

export type RunStatusApi =
  | "queued"
  | "running"
  | "succeeded"
  | "failed"
  | "skipped"
  | "rejected"
  | "needs_manual_action";
export type Role = "admin" | "operator";

export interface AuthUser {
  id: string;
  name?: string;
  email?: string;
  role: Role;
}

export interface AuthTenant {
  id: string;
  name?: string;
  status?: string;
  created_at?: string;
}

export interface AuthResponse {
  user: AuthUser;
  tenant: AuthTenant;
  access_token: string;
}

export interface RunsListItem {
  id: string;
  tenant_id: string;
  project_id: string;
  created_by_user_id: string;
  original_ticket_key: string;
  original_ticket_url: string;
  shadow_ticket_key: string;
  shadow_ticket_url: string;
  workflow_type: string;
  status: RunStatusApi;
  confidence_score: number | null;
  confidence_decision: "approved" | "rejected" | null;
  pr_url: string;
  error_message: string;
  created_at: string;
  updated_at: string;
}

export interface RunEvent {
  id: string;
  run_id: string;
  level: "info" | "warn" | "error" | "debug";
  event_type: string;
  message: string;
  payload_json: Record<string, unknown> | string;
  created_at: string;
}

export interface RunDetail {
  run: {
    id: string;
    status: RunStatusApi;
    confidence_score: number | null;
    confidence_decision: "approved" | "rejected" | null;
    original_ticket_key: string;
    original_ticket_url: string;
    shadow_ticket_key: string;
    shadow_ticket_url: string;
    pr_url: string;
    workflow_type?: string;
    project_id?: string;
    parent_run_id?: string;
    created_by_user_id?: string;
    created_at?: string;
    updated_at?: string;
    error_message?: string;
  };
  events: RunEvent[];
}

export interface ProjectItem {
  id: string;
  tenant_id: string;
  name: string;
  ticket_source_type: "jira" | "linear";
  ticket_source_project_key: string;
  repo_owner: string;
  repo_name: string;
  repo_default_branch: string;
  workflow_type: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface IntegrationItem {
  id: string;
  tenant_id: string;
  provider: "github" | "jira" | "linear" | string;
  name?: string;
  config_json?: Record<string, unknown>;
  is_active?: boolean;
  health_status?: "healthy" | "unhealthy" | "unknown";
  connected_at?: string;
  last_error?: string;
  /** When omitted, treat as unknown and infer from masked hint / connection signals in UI. */
  has_credentials?: boolean;
  masked_credentials_hint?: string;
}

export interface RunArtifactItem {
  id: string;
  run_id: string;
  artifact_type: string;
  name?: string;
  preview?: string;
  created_at?: string;
}

export interface RunArtifactDetail extends RunArtifactItem {
  content: unknown;
}

export interface UserItem {
  id: string;
  tenant_id?: string;
  name?: string;
  email: string;
  role: Role;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface WebhookSubscription {
  id: string;
  project_id: string;
  provider: string;
  event_types: string[];
  filters: Record<string, unknown>;
  auto_trigger: boolean;
}

export interface HealthStatusResponse {
  status: string;
  [key: string]: unknown;
}

export interface OnboardingStatus {
  is_complete: boolean;
  steps: {
    admin_created: boolean;
    integration_connected: boolean;
    project_created: boolean;
    first_run_ready: boolean;
  };
  missing_steps: string[];
  integrations_connected: number;
  projects_configured: number;
  has_admin_user: boolean;
  first_run_possible: boolean;
}

export interface DashboardSummary {
  tenant: {
    id: string;
    name: string;
    status: string;
    created_at: string;
  };
  stats: {
    projects_total: number;
    runs_total: number;
    runs_successful: number;
    runs_failed: number;
    runs_active: number;
    success_rate_pct: number;
    integrations_connected: number;
    integrations_unhealthy: number;
  };
  recent_runs: Array<{
    id: string;
    status: RunStatusApi;
    original_ticket_key: string;
    workflow_type: string;
    created_at: string;
  }>;
  recent_pull_requests: Array<{
    id: string;
    pr_url: string;
    status: RunStatusApi;
    created_at: string;
  }>;
}
