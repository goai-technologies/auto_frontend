import { apiRequest } from "./client";
import type { PaginationMeta, ProjectItem } from "./types";

export interface ProjectsListParams {
  page?: number;
  page_size?: number;
  q?: string;
  is_active?: boolean;
  ticket_source_type?: "jira" | "linear";
}

export interface ProjectsListResponse {
  items: ProjectItem[];
  pagination: PaginationMeta;
}

export function listProjects(params: ProjectsListParams = {}) {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.page_size) search.set("page_size", String(params.page_size));
  if (params.q) search.set("q", params.q);
  if (typeof params.is_active === "boolean") search.set("is_active", String(params.is_active));
  if (params.ticket_source_type) search.set("ticket_source_type", params.ticket_source_type);
  const qs = search.toString();
  return apiRequest<ProjectsListResponse>(`/projects${qs ? `?${qs}` : ""}`);
}

export function getProject(projectId: string) {
  return apiRequest<ProjectItem>(`/projects/${encodeURIComponent(projectId)}`);
}

export function createProject(body: {
  project_id?: string;
  name: string;
  default_workflow: string;
  repo: { owner: string; name: string; default_branch: string };
  issue_source: { provider: "jira" | "linear"; project_key: string };
}) {
  return apiRequest<ProjectItem>("/projects", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
