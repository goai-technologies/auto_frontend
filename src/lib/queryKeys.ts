export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  dashboard: {
    summary: ["dashboard", "summary"] as const,
  },
  runs: {
    list: (params: Record<string, unknown>) => ["runs", "list", params] as const,
    detail: (runId?: string) => ["runs", "detail", runId] as const,
    events: (runId?: string) => ["runs", "events", runId] as const,
    progress: (runId?: string) => ["runs", "progress", runId] as const,
    artifacts: (runId?: string, params?: Record<string, unknown>) => ["runs", "artifacts", runId, params] as const,
    artifact: (runId?: string, artifactId?: string) => ["runs", "artifact", runId, artifactId] as const,
  },
  projects: {
    list: (params: Record<string, unknown>) => ["projects", "list", params] as const,
    detail: (projectId?: string) => ["projects", "detail", projectId] as const,
  },
  integrations: {
    list: (params: Record<string, unknown>) => ["integrations", "list", params] as const,
    providers: ["integrations", "providers"] as const,
  },
  onboarding: {
    status: ["onboarding", "status"] as const,
  },
  users: {
    list: (params: Record<string, unknown>) => ["users", "list", params] as const,
    detail: (userId?: string) => ["users", "detail", userId] as const,
  },
  system: {
    health: ["system", "healthz"] as const,
    readiness: ["system", "ready"] as const,
    detail: ["system", "detail"] as const,
  },
};
