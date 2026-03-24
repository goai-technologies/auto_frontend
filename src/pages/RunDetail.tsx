import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDateTime } from "@/lib/format";
import { ExternalLink, ArrowLeft, RefreshCw, Loader2 } from "lucide-react";
import { getRun, listRunEvents, type RunEventRow, type RunRow } from "@/lib/api";

const POLL_INTERVAL_MS = 2000;

const levelColors: Record<string, string> = {
  info: "text-info",
  warn: "text-warning",
  error: "text-destructive",
  debug: "text-muted-foreground",
};

const stepLabels: Record<string, string> = {
  init: "Init",
  prd_lite: "PRD Lite",
  repo_navigator: "Repo Navigator",
  impl_plan: "Implementation Plan",
  implementation: "Implementation",
  ac_check: "AC Check",
  qa: "QA",
  pr_creation: "PR Creation",
  workflow_started: "Started",
  workflow_completed: "Completed",
  workflow_failed: "Failed",
};

function parsePayload(payloadJson: string): Record<string, unknown> {
  if (!payloadJson?.trim()) return {};
  try {
    const p = JSON.parse(payloadJson);
    return typeof p === "object" && p !== null ? p : {};
  } catch {
    return {};
  }
}

function isTerminalEvent(eventType: string) {
  return eventType === "workflow_completed" || eventType === "workflow_failed";
}

type LogStatus = "running" | "succeeded" | "failed" | "info";

function prettyJson(value: unknown) {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function formatAgentToolName(tool: string) {
  // get_jira_issue -> Get Jira Issue Agent
  const words = tool
    .split(/[_\s-]+/g)
    .map((w) => w.trim())
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1));
  const base = words.length ? words.join(" ") : tool;
  return `${base} Agent`;
}

function buildLogRow(event: RunEventRow) {
  const payload = parsePayload(event.payload_json);

  // Defaults
  let toolName = stepLabels[event.event_type] || event.event_type;
  let status: LogStatus = event.level === "error" ? "failed" : "info";
  let description = event.payload_json;

  if (event.event_type === "tool_step") {
    const tool = typeof payload.tool === "string" ? payload.tool : "tool_step";
    const phase = typeof payload.phase === "string" ? payload.phase : undefined;
    const stepStatus = typeof payload.status === "string" ? payload.status : undefined;
    const durationMs = typeof payload.duration_ms === "number" ? payload.duration_ms : undefined;
    const error = typeof payload.error === "string" ? payload.error : null;

    toolName = formatAgentToolName(tool);
    if (stepStatus === "started") status = "running";
    else if (stepStatus === "succeeded") status = "succeeded";
    else if (stepStatus === "failed") status = "failed";
    else status = "info";

    const parts: string[] = [];
    if (phase) parts.push(phase);
    if (durationMs != null) parts.push(`${durationMs}ms`);
    if (error) parts.push(error);
    // Fallback to showing payload if we couldn't produce anything meaningful.
    description = parts.length ? parts.join(" · ") : prettyJson(payload);
  } else if (event.event_type === "workflow_started") {
    toolName = "workflow_started";
    status = "running";
    const issue = typeof payload.issue_key_or_id === "string" ? payload.issue_key_or_id : undefined;
    const provider = typeof payload.issue_provider === "string" ? payload.issue_provider : undefined;
    description = issue && provider ? `${provider.toUpperCase()} · ${issue}` : prettyJson(payload);
  } else if (event.event_type === "workflow_completed") {
    toolName = "workflow_completed";
    status = "succeeded";
    const prUrl = typeof payload.pr_url === "string" ? payload.pr_url : undefined;
    description = prUrl ? `PR created · ${prUrl}` : prettyJson(payload);
  } else if (event.event_type === "workflow_failed") {
    toolName = "workflow_failed";
    status = "failed";
    const err = typeof payload.error === "string" ? payload.error : undefined;
    description = err || prettyJson(payload);
  }

  return { toolName, status, description };
}

const RunDetail = () => {
  const { runId } = useParams<{ runId: string }>();
  const decodedId = runId ? decodeURIComponent(runId) : undefined;
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const runQuery = useQuery({
    queryKey: ["run", decodedId],
    queryFn: () => getRun(decodedId!),
    enabled: !!decodedId,
  });

  const eventsQuery = useQuery({
    queryKey: ["run-events", decodedId],
    queryFn: () => listRunEvents(decodedId!),
    enabled: !!decodedId,
    refetchInterval: (query) => {
      const events = (query.state.data as RunEventRow[] | undefined) ?? [];
      const last = events[events.length - 1];
      if (last && isTerminalEvent(last.event_type)) return false;
      return POLL_INTERVAL_MS;
    },
  });

  const runData = runQuery.data;
  const run = runData?.run;
  const events = (eventsQuery.data ?? runData?.events ?? []) as RunEventRow[];
  const isLoadingRun = runQuery.isLoading || !run;
  const isRunError = runQuery.isError && !runData;

  const terminalEvent = events.find((e) => isTerminalEvent(e.event_type));
  const terminalPayload = terminalEvent ? parsePayload(terminalEvent.payload_json) : {};
  const runLog = typeof terminalPayload.log === "string" ? terminalPayload.log : null;
  const durationSeconds = typeof terminalPayload.duration_seconds === "number" ? terminalPayload.duration_seconds : null;
  const payloadPrUrl = typeof terminalPayload.pr_url === "string" ? terminalPayload.pr_url : null;
  const payloadError = typeof terminalPayload.error === "string" ? terminalPayload.error : null;
  const displayPrUrl = run?.pr_url || payloadPrUrl;

  const eventRows = useMemo(() => {
    return events.map((event, i) => {
      const row = buildLogRow(event);
      const key = (event.event_id ?? `${event.timestamp}-${i}`) as string;
      return { event, row, key };
    });
  }, [events]);

  if (isRunError) {
    return (
      <div className="flex w-full justify-center">
        <div className="flex w-full max-w-6xl flex-col gap-6">
          <p className="text-muted-foreground">Run not found.</p>
        </div>
      </div>
    );
  }

  if (isLoadingRun) {
    return (
      <div className="flex w-full justify-center">
        <div className="flex w-full max-w-6xl flex-col gap-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-lg font-medium text-foreground">Loading run…</span>
            </div>
          </div>
          <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Run Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center gap-4 py-16">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Fetching run details and logs…</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const runRow = run as RunRow;
  const startedAt = (runRow as { started_at?: string }).started_at ?? runRow.created_at;
  const isLive = runRow.status === "running" && !terminalEvent;

  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full max-w-6xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to={`/projects/${runRow.project_id}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-mono text-foreground">
                  {runRow.issue_key_or_id}
                </h1>
                <StatusBadge status={runRow.status} />
                {isLive && (
                  <span className="flex items-center gap-2 text-xs text-success">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                    </span>
                    Live
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {runRow.project_id} · {runRow.workflow} · {formatDateTime(startedAt)}
                {durationSeconds != null && ` · ${durationSeconds}s`}
              </p>
              {payloadError && (
                <p className="text-sm text-destructive mt-1">{payloadError}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {displayPrUrl && (
              <a href={displayPrUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" /> Open PR
                </Button>
              </a>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                runQuery.refetch();
                eventsQuery.refetch();
              }}
            >
              <RefreshCw className="h-4 w-4 mr-1" /> Refresh
            </Button>
          </div>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Run Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {runLog ? (
              <div className="max-h-[500px] overflow-y-auto rounded-lg border border-border/50 bg-background/60 p-4">
                <pre className="whitespace-pre-wrap font-mono text-xs text-foreground">{runLog}</pre>
              </div>
            ) : (
              <div className="max-h-[560px] overflow-y-auto overflow-x-hidden rounded-lg border border-border/50 bg-background/60 font-mono text-xs">
                <div className="sticky top-0 z-10 grid grid-cols-[minmax(180px,240px)_minmax(160px,260px)_110px_minmax(0,1fr)] gap-4 border-b border-border/40 bg-background/70 px-4 py-2 text-[11px] text-muted-foreground backdrop-blur">
                  <div>Date/Time</div>
                  <div>Tool</div>
                  <div>Status</div>
                  <div>Raw data</div>
                </div>

                {events.length === 0 && eventsQuery.isLoading && (
                  <div className="flex items-center gap-2 px-4 py-4 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Waiting for events…
                  </div>
                )}

                <div className="divide-y divide-border/30">
                  {eventRows.map(({ event, row, key }) => {
                    const statusColor =
                      row.status === "running"
                        ? "text-warning"
                        : row.status === "succeeded"
                          ? "text-success"
                          : row.status === "failed"
                            ? "text-destructive"
                            : levelColors[event.level] ?? "text-muted-foreground";

                    const isExpanded = !!expanded[key];
                    const payload = parsePayload(event.payload_json);
                    const pretty = JSON.stringify(payload, null, 2);

                    return (
                      <div
                        key={key}
                        className="grid grid-cols-[minmax(180px,240px)_minmax(160px,260px)_110px_minmax(0,1fr)] gap-4 px-4 py-2 leading-relaxed"
                      >
                        <div className="min-w-0 text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                          {formatDateTime(event.timestamp)}
                        </div>
                        <div className="min-w-0 text-primary break-all">{row.toolName}</div>
                        <div className={`font-semibold ${statusColor}`}>{row.status}</div>
                        <div className="text-foreground">
                          <button
                            type="button"
                            onClick={() => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))}
                            className="w-full text-left"
                            title="Click to expand/collapse"
                          >
                            {!isExpanded ? (
                              <span className="block truncate text-muted-foreground">
                                {event.payload_json}
                              </span>
                            ) : (
                              <pre className="whitespace-pre-wrap break-words text-foreground">{pretty}</pre>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RunDetail;

