import { apiRequest } from "./client";
import type {
  PaginationMeta,
  RunArtifactDetail,
  RunArtifactItem,
  RunDetail,
  RunEvent,
  RunStatusApi,
  RunsListItem,
} from "./types";

export interface RunsListParams {
  status?: string;
  workflow_type?: string;
  project_id?: string;
  created_by_user_id?: string;
  confidence_decision?: "approved" | "rejected";
  has_pr?: boolean;
  q?: string;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface RunsListResponse {
  items: RunsListItem[];
  pagination: PaginationMeta;
}

export interface RunProgressPhase {
  key: string;
  label: string;
  status: "pending" | "in_progress" | "completed" | "failed";
}

export interface RunProgressResponse {
  total_steps: number;
  completed_steps: number;
  active_step: { key: string; label: string } | null;
  phases: RunProgressPhase[];
  run_status: RunStatusApi;
  is_terminal: boolean;
  recommended_poll_interval_ms: number;
  last_event_at?: string;
}

export function listRuns(params: RunsListParams = {}) {
  const search = new URLSearchParams();
  if (params.status) search.set("status", params.status);
  if (params.workflow_type) search.set("workflow_type", params.workflow_type);
  if (params.project_id) search.set("project_id", params.project_id);
  if (params.created_by_user_id) search.set("created_by_user_id", params.created_by_user_id);
  if (params.confidence_decision) search.set("confidence_decision", params.confidence_decision);
  if (typeof params.has_pr === "boolean") search.set("has_pr", String(params.has_pr));
  if (params.q) search.set("q", params.q);
  if (params.page) search.set("page", String(params.page));
  if (params.page_size) search.set("page_size", String(params.page_size));
  if (params.sort_by) search.set("sort_by", params.sort_by);
  if (params.sort_order) search.set("sort_order", params.sort_order);
  const qs = search.toString();
  return apiRequest<RunsListResponse>(`/runs${qs ? `?${qs}` : ""}`);
}

export function getRun(runId: string) {
  return apiRequest<RunDetail>(`/runs/${encodeURIComponent(runId)}`);
}

export function listRunEvents(runId: string) {
  return apiRequest<RunEvent[]>(`/runs/${encodeURIComponent(runId)}/events`);
}

export function getRunProgress(runId: string) {
  return apiRequest<RunProgressResponse>(`/runs/${encodeURIComponent(runId)}/progress`);
}

export function startRun(
  projectId: string,
  body: {
    ticket_url?: string;
    issue_key?: string;
    confidence_score?: number;
    initiated_by_type?: string;
    initiated_by_id?: string;
  },
) {
  return apiRequest<{
    run_id?: string;
    status?: RunStatusApi;
    queued?: boolean;
    rejected?: boolean;
    message?: string;
  }>(`/projects/${encodeURIComponent(projectId)}/runs`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export interface RerunResponse {
  run_id: string;
  parent_run_id: string;
  status: RunStatusApi;
}

export function rerunRun(runId: string) {
  return apiRequest<RerunResponse>(`/runs/${encodeURIComponent(runId)}/rerun`, { method: "POST" });
}

export interface StepRerunResponse {
  step_id: string;
  attempt_no: number;
  status: RunStatusApi;
  continued_steps?: string[];
}

export function rerunStep(runId: string, stepId: string) {
  return apiRequest<StepRerunResponse>(`/runs/${encodeURIComponent(runId)}/steps/${encodeURIComponent(stepId)}/rerun`, {
    method: "POST",
  });
}

export interface RunArtifactsListParams {
  type?: string;
  artifact_type?: string;
  q?: string;
  page?: number;
  page_size?: number;
}

export interface RunArtifactsListResponse {
  items: RunArtifactItem[];
  pagination: PaginationMeta;
}

export function listRunArtifacts(runId: string, params: RunArtifactsListParams = {}) {
  const search = new URLSearchParams();
  if (params.type) search.set("type", params.type);
  if (params.artifact_type) search.set("artifact_type", params.artifact_type);
  if (params.q) search.set("q", params.q);
  if (params.page) search.set("page", String(params.page));
  if (params.page_size) search.set("page_size", String(params.page_size));
  const qs = search.toString();
  return apiRequest<RunArtifactsListResponse>(`/runs/${encodeURIComponent(runId)}/artifacts${qs ? `?${qs}` : ""}`);
}

export function getRunArtifactDetail(runId: string, artifactId: string) {
  return apiRequest<RunArtifactDetail>(`/runs/${encodeURIComponent(runId)}/artifacts/${encodeURIComponent(artifactId)}`);
}
