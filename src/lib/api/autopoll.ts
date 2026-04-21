import { apiRequest } from "./client";

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
  return apiRequest<AutoPollRuleRow[]>(`/autopoll-rules/${encodeURIComponent(projectId)}`);
}

export function upsertAutoPollRule(projectId: string, body: any) {
  return apiRequest<AutoPollRuleRow>(`/autopoll-rules/${encodeURIComponent(projectId)}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}
