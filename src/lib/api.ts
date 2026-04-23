import { toast } from "@/hooks/use-toast";
import { getRuntimeEnv } from "./runtime-config";

const API_BASE = getRuntimeEnv("VITE_API_BASE_URL") ?? import.meta.env.VITE_API_BASE_URL ?? "/api/v1";
const TOKEN_KEY = "goai_token";

export function getAuthToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string | null) {
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

interface Envelope<T> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const AUTH_REDIRECT_FLAG = "goai_auth_redirecting";

function isEnvelope<T>(value: unknown): value is Envelope<T> {
  if (!value || typeof value !== "object") return false;
  // We treat it as an envelope if it has either `data` or `error` keys.
  return "data" in value || "error" in value;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
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

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 204) {
    // No content.
    return undefined as unknown as T;
  }

  const rawJson = await res.json().catch(() => ({}));
  const json = (isEnvelope<T>(rawJson) ? rawJson : { data: rawJson }) as Envelope<T>;

  if (!res.ok) {
    if (
      res.status === 401 &&
      // Don't redirect on invalid credentials during login/register flows.
      !path.startsWith("/auth/login") &&
      !path.startsWith("/auth/register")
    ) {
      setAuthToken(null);
      const publicPaths = new Set(["/landing", "/login", "/register", "/onboarding"]);
      const isOnPublicPage = publicPaths.has(window.location.pathname);
      const alreadyRedirecting = window.sessionStorage.getItem(AUTH_REDIRECT_FLAG) === "1";

      // Avoid infinite reload loops if the app home page requires auth.
      if (!isOnPublicPage && !alreadyRedirecting) {
        window.sessionStorage.setItem(AUTH_REDIRECT_FLAG, "1");
        toast({
          title: "Session expired",
          description: "Please sign in again.",
        });
        // Hard redirect so we reset any in-memory state, but go to a public page.
        window.location.replace("/login");
      }
    }

    const message =
      json.error?.message ||
      (typeof (rawJson as any)?.message === "string" ? (rawJson as any).message : undefined) ||
      (typeof (rawJson as any)?.detail === "string" ? (rawJson as any).detail : undefined) ||
      `Request failed with status ${res.status}`;
    const code = json.error?.code;
    throw new ApiError(message, res.status, code);
  }

  if (json.data === undefined) {
    throw new ApiError("Malformed response from server", res.status);
  }

  return json.data;
}

// -------- Auth --------

export interface AuthUser {
  id: string;
  name?: string;
  email?: string;
  role: string;
}

export interface AuthTenant {
  id: string;
  name?: string;
  status?: string;
}

export interface AuthResponse {
  user: AuthUser;
  tenant: AuthTenant;
  access_token: string;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setAuthToken(data.access_token);
  window.sessionStorage.removeItem(AUTH_REDIRECT_FLAG);
  return data;
}

export async function register(payload: {
  name: string;
  org_name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const data = await request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setAuthToken(data.access_token);
  return data;
}

export async function getMe(): Promise<{ user: AuthUser; tenant: AuthTenant }> {
  return request<{ user: AuthUser; tenant: AuthTenant }>("/auth/me");
}

// -------- Dashboard --------

export type RunStatusApi = "queued" | "running" | "succeeded" | "failed" | "skipped" | "rejected";

export interface DashboardRun {
  run_id: string;
  tenant_id: string;
  project_id: string;
  workflow: string;
  issue_provider: string;
  issue_key_or_id: string;
  repo_owner: string;
  repo_name: string;
  branch: string;
  status: RunStatusApi;
  confidence_score?: number | null;
  confidence_decision?: "approved" | "rejected" | null;
  original_ticket_key?: string;
  original_ticket_url?: string;
  shadow_ticket_key?: string;
  shadow_ticket_url?: string;
  pr_url?: string;
  created_at: string;
  updated_at?: string;
  initiated_by_type: string;
  initiated_by_id: string;
}

export interface DashboardSummary {
  tenant: {
    id: string;
    name: string;
    status: string;
    created_at: string;
  };
  integrations: {
    provider: "github" | "jira" | "linear";
    connected: boolean;
    connected_at?: string;
  }[];
  projects_count: number;
  successful_runs_count: number;
  active_runs_count: number;
  recent_runs: DashboardRun[];
}

export function getDashboardSummary() {
  return request<DashboardSummary>("/dashboard/summary");
}

// -------- Integrations --------

export interface IntegrationRow {
  id: string;
  tenant_id: string;
  provider: "github" | "jira" | "linear";
  status: "connected" | "error" | "disconnected";
  connected_at?: string;
  last_error?: string;
  metadata_json?: string;
}

export function listIntegrations() {
  return request<IntegrationRow[]>("/integrations");
}

export function connectGithub(body: { installation_id: string; org: string }) {
  return request<IntegrationRow>("/integrations/github/connect", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function connectJira(body: {
  base_url: string;
  email_or_user: string;
  api_token: string;
  project_keys: string[];
}) {
  return request<IntegrationRow>("/integrations/jira/connect", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function connectLinear(body: { api_key: string }) {
  return request<IntegrationRow>("/integrations/linear/connect", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// -------- Projects --------

export interface ProjectRow {
  project_id: string;
  tenant_id: string;
  name: string;
  repo_provider: string;
  repo_owner: string;
  repo_name: string;
  default_branch: string;
  issue_provider: "jira" | "linear";
  issue_project_key_or_team: string;
  default_workflow: string;
}

export function listProjects() {
  return request<ProjectRow[]>("/projects");
}

export function createProject(body: {
  project_id?: string;
  name: string;
  repo: { provider: string; owner: string; name: string; default_branch: string };
  issue_source: { provider: "jira" | "linear"; project_key: string };
  default_workflow: string;
}) {
  return request<ProjectRow>("/projects", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function getProject(projectId: string) {
  return request<ProjectRow>(`/projects/${encodeURIComponent(projectId)}`);
}

// -------- Runs / Activity --------

export interface RunRow {
  run_id: string;
  tenant_id: string;
  project_id: string;
  workflow: string;
  issue_provider: string;
  issue_key_or_id: string;
  repo_owner: string;
  repo_name: string;
  branch: string;
  status: RunStatusApi;
  confidence_score?: number | null;
  confidence_decision?: "approved" | "rejected" | null;
  original_ticket_key?: string;
  original_ticket_url?: string;
  shadow_ticket_key?: string;
  shadow_ticket_url?: string;
  parent_run_id?: string;
  pr_url?: string;
  created_at: string;
  updated_at?: string;
  initiated_by_type: string;
  initiated_by_id: string;
}

export function listRuns(params: { project_id?: string; status?: string; issue_key?: string } = {}) {
  const search = new URLSearchParams();
  if (params.project_id) search.set("project_id", params.project_id);
  if (params.status) search.set("status", params.status);
  if (params.issue_key) search.set("issue_key", params.issue_key);
  const qs = search.toString();
  const suffix = qs ? `?${qs}` : "";
  return request<RunRow[]>(`/runs${suffix}`);
}

export function getRun(runId: string) {
  return request<{ run: RunRow; events: RunEventRow[] }>(`/runs/${encodeURIComponent(runId)}`);
}

export interface RunEventRow {
  event_id: string;
  run_id: string;
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  event_type: string;
  payload_json: string;
}

export function listRunEvents(runId: string) {
  return request<RunEventRow[]>(`/runs/${encodeURIComponent(runId)}/events`);
}

export function startRun(projectId: string, body: {
  ticket_url?: string;
  issue_key?: string;
  initiated_by_type?: string;
  initiated_by_id?: string;
  confidence_score?: number;
}) {
  return request<{ run_id: string; status: RunStatusApi }>(`/projects/${encodeURIComponent(projectId)}/runs`, {
    method: "POST",
    body: JSON.stringify({
      initiated_by_type: "ui",
      ...body,
    }),
  });
}

export interface RerunResponse {
  run_id: string;
  parent_run_id: string;
  status: RunStatusApi;
}

export function rerunRun(runId: string) {
  return request<RerunResponse>(`/runs/${encodeURIComponent(runId)}/rerun`, {
    method: "POST",
  });
}

export interface StepRerunResponse {
  step_id: string;
  attempt_no: number;
  status: RunStatusApi;
}

export function rerunStep(runId: string, stepId: string) {
  return request<StepRerunResponse>(`/runs/${encodeURIComponent(runId)}/steps/${encodeURIComponent(stepId)}/rerun`, {
    method: "POST",
  });
}

// -------- Auto-poll --------

export interface AutoPollRuleRow {
  rule_id: string;
  tenant_id: string;
  project_id: string;
  provider: "jira" | "linear";
  jql?: string;
  linear_states?: string[];
  linear_assignee?: string;
  interval_seconds: string;
  active: string;
  last_run_at?: string;
  last_error?: string;
}

export function getAutoPollRules(projectId: string) {
  return request<AutoPollRuleRow[]>(`/autopoll-rules/${encodeURIComponent(projectId)}`);
}

export function upsertAutoPollRule(projectId: string, body: any) {
  return request<AutoPollRuleRow>(`/autopoll-rules/${encodeURIComponent(projectId)}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export { ApiError };

