import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { ArrowLeft, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useRunDetail, useRunEvents, useRunProgress, useRerunRun, useRerunStep } from "@/hooks/api/useRuns";
import { PageState } from "@/components/common/PageState";
import { ConfirmActionDialog } from "@/components/common/ConfirmActionDialog";
import { RunSummaryCard } from "@/components/runs/RunSummaryCard";
import { RunStepTimeline } from "@/components/runs/RunStepTimeline";
import { RunEventsPanel } from "@/components/runs/RunEventsPanel";

const RunDetail = () => {
  const { runId } = useParams<{ runId: string }>();
  const decodedRunId = runId ? decodeURIComponent(runId) : undefined;
  const runQuery = useRunDetail(decodedRunId, { refetchIntervalMs: 2000 });
  const eventsQuery = useRunEvents(decodedRunId, { refetchIntervalMs: 2000 });
  const runProgressQuery = useRunProgress(decodedRunId);
  const rerunMutation = useRerunRun(decodedRunId);
  const rerunStepMutation = useRerunStep(decodedRunId);

  const run = runQuery.data?.run;
  const events = useMemo(() => eventsQuery.data ?? runQuery.data?.events ?? [], [eventsQuery.data, runQuery.data?.events]);

  const rerunLockState = useMemo(() => {
    let startedAt: number | null = null;
    let settledAt: number | null = null;
    for (const event of events) {
      const ts = Date.parse(event.created_at);
      // Only use explicit step rerun lifecycle markers for UI lock state.
      if (event.event_type === "step_rerun_started") {
        if (!Number.isNaN(ts)) startedAt = Math.max(startedAt ?? ts, ts);
      }
      if (event.event_type === "step_rerun_completed" || event.event_type === "step_rerun_failed") {
        if (!Number.isNaN(ts)) settledAt = Math.max(settledAt ?? ts, ts);
      }
    }
    return !!startedAt && (!settledAt || startedAt > settledAt);
  }, [events]);

  const progress = useMemo(() => {
    type StepState = {
      name: string;
      status: "pending" | "running" | "completed";
      toolName?: string;
    };
    const stepOrder: string[] = [];
    const stepMap = new Map<string, StepState>();

    for (const event of events) {
      const payload =
        typeof event.payload_json === "object" && event.payload_json !== null
          ? (event.payload_json as Record<string, unknown>)
          : null;
      const stepName = typeof payload?.step_name === "string" ? payload.step_name : undefined;
      const toolName = typeof payload?.tool_name === "string" ? payload.tool_name : undefined;
      if (!stepName) continue;

      if (!stepMap.has(stepName)) {
        stepOrder.push(stepName);
        stepMap.set(stepName, { name: stepName, status: "pending", toolName });
      }

      const existing = stepMap.get(stepName)!;
      if (event.event_type === "mcp_step_started") {
        existing.status = "running";
      } else if (event.event_type === "mcp_step_completed") {
        existing.status = "completed";
      }
      if (toolName) existing.toolName = toolName;
    }

    const steps = stepOrder.map((name) => stepMap.get(name)!);
    const total = steps.length;
    const completed = steps.filter((s) => s.status === "completed").length;
    const active = [...steps].reverse().find((s) => s.status === "running");

    return {
      steps,
      total,
      completed,
      active,
      percent: total ? Math.round((completed / total) * 100) : 0,
    };
  }, [events]);

  const progressCard = useMemo(() => {
    const progressApi = runProgressQuery.data;
    if (progressApi) {
      return {
        completed: progressApi.completed_steps,
        total: progressApi.total_steps,
        activeText: progressApi.active_step?.label ?? "No active step",
        pollMs: progressApi.recommended_poll_interval_ms ?? 2000,
        phases: progressApi.phases,
        percent:
          progressApi.total_steps > 0
            ? Math.round((progressApi.completed_steps / progressApi.total_steps) * 100)
            : 0,
      };
    }
    return {
      completed: progress.completed,
      total: progress.total,
      activeText: progress.active ? `${progress.active.toolName ?? "mcp_agent"} (${progress.active.name})` : "No active step",
      pollMs: 2000,
      phases: [],
      percent: progress.percent,
    };
  }, [runProgressQuery.data, progress]);

  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full max-w-6xl flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Link to="/activity">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="space-y-0.5">
              <h1 className="text-xl font-bold font-mono text-foreground">{decodedRunId}</h1>
              <p className="text-xs text-muted-foreground">Run operational detail view</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {run?.pr_url && (
              <a href={run.pr_url} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="h-8 px-2.5 text-xs">
                  <ExternalLink className="mr-1 h-4 w-4" /> Open PR
                </Button>
              </a>
            )}
            <ConfirmActionDialog
              title="Rerun full run?"
              triggerLabel="Rerun run"
              pending={rerunMutation.isPending}
              onConfirm={() =>
                rerunMutation
                  .mutateAsync()
                  .then((data) => {
                    if (!data.run_id) {
                      toast({ title: "Rerun started", description: "Run id not returned yet. Check Activity for status." });
                      return;
                    }
                    toast({ title: "Rerun started" });
                    window.location.assign(`/runs/${encodeURIComponent(data.run_id)}`);
                  })
                  .catch((err: any) => toast({ title: "Rerun failed", description: err?.message }))
              }
            />
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-xs"
              onClick={() => {
                runQuery.refetch();
                eventsQuery.refetch();
              }}
            >
              <RefreshCw className="mr-1 h-4 w-4" /> Refresh
            </Button>
          </div>
        </div>

        <div className="rounded-md border border-border/60 bg-card/80 p-2.5">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {progressCard.total
                ? `Progress ${progressCard.completed}/${progressCard.total} steps`
                : "Waiting for workflow steps..."}
            </span>
            <span className="font-medium text-foreground">
              {progressCard.activeText}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded bg-muted">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressCard.percent}%` }} />
          </div>
          {!!progressCard.phases.length && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {progressCard.phases.map((phase) => {
                const phaseClass =
                  phase.status === "completed"
                    ? "bg-success/20 text-success"
                    : phase.status === "in_progress"
                      ? "bg-info/20 text-info"
                      : phase.status === "failed"
                        ? "bg-destructive/20 text-destructive"
                        : "bg-muted text-muted-foreground";
                return (
                  <span key={phase.key} className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${phaseClass}`}>
                    {phase.label}
                    {phase.status === "in_progress" ? " (running)" : ""}
                  </span>
                );
              })}
            </div>
          )}
          <p className="mt-1 text-[11px] text-muted-foreground">
            Auto-refreshing run and timeline every {Math.max(1, Math.round(progressCard.pollMs / 1000))}s.
          </p>
          {runProgressQuery.isError && (
            <p className="mt-1 text-[11px] text-amber-600">
              Progress endpoint unavailable, showing fallback timeline-based progress.
            </p>
          )}
        </div>

        <PageState
          loading={runQuery.isLoading}
          error={runQuery.isError ? "Failed to load run details." : null}
          onRetry={() => runQuery.refetch()}
        >
          <div className="space-y-3">
            {run && <RunSummaryCard run={run} />}
            <div className="rounded-md border border-border/60">
              <div className="border-b border-border/50 px-3 py-2">
                <p className="text-xs font-medium text-foreground">Ticket Links</p>
              </div>
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-border/40">
                    <td className="px-3 py-1.5 text-muted-foreground">Original</td>
                    <td className="px-3 py-1.5 text-right">
                      <a href={run?.original_ticket_url || "#"} className="text-primary hover:underline">
                        {run?.original_ticket_key || "—"}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-1.5 text-muted-foreground">Shadow</td>
                    <td className="px-3 py-1.5 text-right">
                      <a href={run?.shadow_ticket_url || "#"} className="text-primary hover:underline">
                        {run?.shadow_ticket_key || "—"}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
              {run?.status === "rejected" && (
                <p className="border-t border-border/40 px-3 py-2 text-xs text-destructive">
                  This run was stopped automatically because confidence was below 0.80.
                </p>
              )}
              {run?.status === "needs_manual_action" && (
                <p className="border-t border-border/40 px-3 py-2 text-xs text-amber-600">
                  This run needs manual action before automation can proceed. Review events and rerun when ready.
                </p>
              )}
            </div>
            <RunStepTimeline
              events={events}
              runStatus={run?.status}
              rerunLocked={rerunLockState}
              rerunPending={rerunStepMutation.isPending}
              onRerunStep={(stepId) => {
                toast({ title: "Rerun started..." });
                rerunStepMutation
                  .mutateAsync({ stepId })
                  .then((result) => {
                    toast({
                      title: "Step rerun started",
                      description: `Attempt ${result.attempt_no} · ${result.status}`,
                    });
                    eventsQuery.refetch();
                    runProgressQuery.refetch();
                  })
                  .catch((err: any) => {
                    if (err?.status === 400) {
                      toast({ title: "Rerun failed", description: err?.message ?? "Invalid rerun request." });
                      return;
                    }
                    if (err?.status >= 500) {
                      toast({ title: "Rerun failed, see timeline for details" });
                      return;
                    }
                    toast({ title: "Rerun failed", description: err?.message ?? "Unknown error" });
                  });
              }}
            />
            <RunEventsPanel events={events} />
          </div>
        </PageState>
      </div>
    </div>
  );
};

export default RunDetail;
