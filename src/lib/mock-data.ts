// Mock data for the control plane UI

export const TENANT_ID = "abc-corp";

export const mockTenant = {
  tenant_id: TENANT_ID,
  name: "ABC Corporation",
  status: "active",
  created_at: "2025-11-15T10:00:00Z",
};

export interface Integration {
  provider: "github" | "jira" | "linear";
  connected: boolean;
  connected_at?: string;
  details?: Record<string, string>;
}

export const mockIntegrations: Integration[] = [
  { provider: "github", connected: true, connected_at: "2026-02-20T14:30:00Z", details: { username: "abc-bot" } },
  {
    provider: "jira",
    connected: true,
    connected_at: "2026-02-21T09:00:00Z",
    details: { base_url: "https://abc.atlassian.net" },
  },
  { provider: "linear", connected: false },
];

export interface Project {
  project_id: string;
  name: string;
  repo_provider: string;
  repo_owner: string;
  repo_name: string;
  default_branch: string;
  issue_source: "jira" | "linear";
  issue_source_key: string;
  default_workflow: string;
  created_at: string;
}

export const mockProjects: Project[] = [
  {
    project_id: "payments-service",
    name: "Payments Service",
    repo_provider: "github",
    repo_owner: "abc-corp",
    repo_name: "payments-service",
    default_branch: "main",
    issue_source: "jira",
    issue_source_key: "PAY",
    default_workflow: "jira-to-pr",
    created_at: "2026-01-10T08:00:00Z",
  },
  {
    project_id: "user-portal",
    name: "User Portal",
    repo_provider: "github",
    repo_owner: "abc-corp",
    repo_name: "user-portal",
    default_branch: "main",
    issue_source: "jira",
    issue_source_key: "USR",
    default_workflow: "jira-to-pr",
    created_at: "2026-02-05T12:00:00Z",
  },
  {
    project_id: "analytics-api",
    name: "Analytics API",
    repo_provider: "github",
    repo_owner: "abc-corp",
    repo_name: "analytics-api",
    default_branch: "develop",
    issue_source: "linear",
    issue_source_key: "ANA",
    default_workflow: "linear-to-pr",
    created_at: "2026-03-01T16:00:00Z",
  },
];

export type RunStatus = "queued" | "running" | "success" | "failed" | "cancelled";

export interface Run {
  run_id: string;
  project_id: string;
  issue_key: string;
  workflow: string;
  status: RunStatus;
  pr_url?: string;
  started_at: string;
  completed_at?: string;
  initiated_by: string;
}

export const mockRuns: Run[] = [
  {
    run_id: "run-001",
    project_id: "payments-service",
    issue_key: "PAY-142",
    workflow: "jira-to-pr",
    status: "success",
    pr_url: "https://github.com/abc-corp/payments-service/pull/87",
    started_at: "2026-03-12T09:15:00Z",
    completed_at: "2026-03-12T09:18:30Z",
    initiated_by: "dev@abc.com",
  },
  {
    run_id: "run-002",
    project_id: "payments-service",
    issue_key: "PAY-143",
    workflow: "jira-to-pr",
    status: "running",
    started_at: "2026-03-12T09:45:00Z",
    initiated_by: "auto-poll",
  },
  {
    run_id: "run-003",
    project_id: "user-portal",
    issue_key: "USR-56",
    workflow: "jira-to-pr",
    status: "failed",
    started_at: "2026-03-11T16:20:00Z",
    completed_at: "2026-03-11T16:22:10Z",
    initiated_by: "admin@abc.com",
  },
  {
    run_id: "run-004",
    project_id: "analytics-api",
    issue_key: "ANA-12",
    workflow: "linear-to-pr",
    status: "success",
    pr_url: "https://github.com/abc-corp/analytics-api/pull/23",
    started_at: "2026-03-11T14:00:00Z",
    completed_at: "2026-03-11T14:04:00Z",
    initiated_by: "dev2@abc.com",
  },
  {
    run_id: "run-005",
    project_id: "payments-service",
    issue_key: "PAY-140",
    workflow: "jira-to-pr",
    status: "success",
    pr_url: "https://github.com/abc-corp/payments-service/pull/86",
    started_at: "2026-03-10T11:00:00Z",
    completed_at: "2026-03-10T11:03:45Z",
    initiated_by: "auto-poll",
  },
];

export interface RunEvent {
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  step: string;
  message: string;
}

export const mockRunEvents: RunEvent[] = [
  { timestamp: "2026-03-12T09:15:00Z", level: "info", step: "init", message: "Run started for PAY-142" },
  {
    timestamp: "2026-03-12T09:15:01Z",
    level: "info",
    step: "prd_lite",
    message: "Generating PRD Lite from Jira ticket...",
  },
  { timestamp: "2026-03-12T09:15:15Z", level: "info", step: "prd_lite", message: "PRD Lite generated successfully" },
  { timestamp: "2026-03-12T09:15:16Z", level: "info", step: "repo_navigator", message: "Scanning repository structure..." },
  { timestamp: "2026-03-12T09:15:45Z", level: "info", step: "repo_navigator", message: "Identified 12 relevant files" },
  { timestamp: "2026-03-12T09:15:46Z", level: "info", step: "impl_plan", message: "Creating implementation plan..." },
  {
    timestamp: "2026-03-12T09:16:20Z",
    level: "info",
    step: "impl_plan",
    message: "Plan: 4 files to modify, 1 new file",
  },
  { timestamp: "2026-03-12T09:16:21Z", level: "info", step: "implementation", message: "Applying changes..." },
  { timestamp: "2026-03-12T09:17:30Z", level: "info", step: "implementation", message: "All changes applied" },
  { timestamp: "2026-03-12T09:17:31Z", level: "info", step: "ac_check", message: "Verifying acceptance criteria..." },
  { timestamp: "2026-03-12T09:17:50Z", level: "info", step: "ac_check", message: "5/5 acceptance criteria met" },
  { timestamp: "2026-03-12T09:17:51Z", level: "info", step: "qa", message: "Running QA checks..." },
  { timestamp: "2026-03-12T09:18:10Z", level: "info", step: "qa", message: "All QA checks passed" },
  { timestamp: "2026-03-12T09:18:11Z", level: "info", step: "pr_creation", message: "Creating pull request..." },
  { timestamp: "2026-03-12T09:18:30Z", level: "info", step: "pr_creation", message: "PR created: #87" },
];

export interface AutoPollRule {
  rule_id: string;
  project_id: string;
  provider: "jira" | "linear";
  jql?: string;
  linear_states?: string[];
  linear_assignee?: string;
  interval_seconds: number;
  active: boolean;
}

export const mockAutoPollRules: Record<string, AutoPollRule> = {
  "payments-service": {
    rule_id: "apr-001",
    project_id: "payments-service",
    provider: "jira",
    jql: 'assignee = currentUser() AND project = PAY AND statusCategory != Done',
    interval_seconds: 60,
    active: true,
  },
};

