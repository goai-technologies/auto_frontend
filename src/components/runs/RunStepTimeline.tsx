import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmActionDialog } from "@/components/common/ConfirmActionDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { RunStatusApi } from "@/lib/api/types";
import type { RunEvent } from "@/lib/api/types";
import { useMemo, useState } from "react";

const SUPPORTED_MCP_STEPS = new Set([
  "prd",
  "analysis",
  "impact",
  "architecture",
  "contracts",
  "plan",
  "implementation",
  "acceptance",
  "qa_plan",
  "security",
  "qa",
]);

type StepStatus = "pending" | "in_progress" | "completed" | "failed" | "stale";

export function RunStepTimeline({
  events,
  runStatus,
  rerunLocked,
  rerunPending,
  onRerunStep,
}: {
  events: RunEvent[];
  runStatus?: RunStatusApi;
  rerunLocked?: boolean;
  rerunPending?: boolean;
  onRerunStep?: (stepId: string) => void;
}) {
  const [openStepOutput, setOpenStepOutput] = useState<string | null>(null);
  const runStatusText = String(runStatus ?? "").toLowerCase();
  const runTerminal =
    !!runStatusText &&
    (runStatusText.includes("failed") ||
      runStatusText.includes("rejected") ||
      runStatusText.includes("succeeded") ||
      runStatusText.includes("completed"));

  const rows = events.map((event) => {
    const payload =
      typeof event.payload_json === "object" && event.payload_json !== null
        ? (event.payload_json as Record<string, unknown>)
        : null;
    const stepName = typeof payload?.step_name === "string" ? payload.step_name : "—";
    const toolName = typeof payload?.tool_name === "string" ? payload.tool_name : "";
    const status = typeof payload?.status === "string" ? payload.status : "";
    const durationSeconds =
      typeof payload?.duration_ms === "number"
        ? `${(payload.duration_ms / 1000).toFixed(payload.duration_ms >= 10000 ? 1 : 2)}s`
        : "—";
    const eventName =
      event.event_type === "mcp_step_started" || event.event_type === "mcp_step_completed"
        ? "mcp_step"
        : event.event_type;

    const attemptNo = typeof payload?.attempt_no === "number" ? payload.attempt_no : null;
    const failureCode = typeof payload?.failure_code === "string" ? payload.failure_code : undefined;
    const summary = typeof payload?.summary === "string" ? payload.summary : undefined;
    const stage = typeof payload?.stage === "string" ? payload.stage : undefined;
    const artifactCount = typeof payload?.artifact_count === "number" ? payload.artifact_count : undefined;
    const hint =
      typeof payload?.hint === "string"
        ? payload.hint
        : typeof payload?.failure_hint === "string"
          ? payload.failure_hint
          : undefined;

    const normalizedStatus =
      status === "started"
        ? "in_progress"
        : status === "completed"
          ? "completed"
          : status === "failed"
            ? "failed"
            : status === "stale"
              ? "stale"
              : "pending";
    const supported = SUPPORTED_MCP_STEPS.has(stepName.toLowerCase());
    const stepFailedOrStale = normalizedStatus === "failed" || normalizedStatus === "stale";
    const canRerun = stepName !== "—" && supported && (runTerminal || stepFailedOrStale);
    const disableRerun = !canRerun || !!rerunLocked || !!rerunPending || !onRerunStep;
    const rerunTooltip = !supported
      ? "Step rerun currently supports MCP steps only"
      : !runTerminal && !stepFailedOrStale
        ? "Step rerun is available after terminal run state or failed/stale step."
        : rerunLocked
          ? "Rerun in progress. Please wait for steady state."
          : undefined;

    return {
      id: event.id,
      eventName,
      step: stepName,
      status: status || "—",
      duration: durationSeconds,
      tool: toolName || "—",
      time: new Date(event.created_at).toLocaleTimeString(),
      attemptNo,
      failureCode,
      summary,
      stage,
      artifactCount,
      hint,
      showActions: stepName !== "—",
      canRerun,
      disableRerun,
      rerunTooltip,
    };
  });

  const stepOutput = useMemo(() => {
    if (!openStepOutput) return null;
    const relatedRows = rows.filter((row) => row.step === openStepOutput);
    if (!relatedRows.length) return null;
    const latest = relatedRows[relatedRows.length - 1];
    const attempts = Math.max(...relatedRows.map((row) => row.attemptNo ?? 1));
    return { step: openStepOutput, rows: relatedRows, latest, attempts };
  }, [openStepOutput, rows]);

  return (
    <Card className="bg-card/80 border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Step Timeline</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="max-h-[560px] overflow-auto rounded-md border border-border/50">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-muted/70 text-muted-foreground backdrop-blur">
              <tr>
                <th className="px-2 py-1.5 text-left font-medium">Event</th>
                <th className="px-2 py-1.5 text-left font-medium">Step</th>
                <th className="px-2 py-1.5 text-left font-medium">Status</th>
                <th className="px-2 py-1.5 text-left font-medium">Duration</th>
                <th className="px-2 py-1.5 text-left font-medium">Tool</th>
                <th className="px-2 py-1.5 text-left font-medium">Time</th>
                <th className="px-2 py-1.5 text-right font-medium">Actions</th>
                <th className="px-2 py-1.5 text-left font-medium">Comments</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-border/40">
                  <td className="px-2 py-1.5 font-medium text-foreground">{row.eventName}</td>
                  <td className="max-w-[120px] truncate px-2 py-1.5 text-foreground" title={row.step}>
                    {row.step}
                    {row.attemptNo && row.attemptNo > 1 ? (
                      <span className="ml-1 rounded bg-muted px-1 py-0.5 text-[10px] text-muted-foreground">Attempt {row.attemptNo}</span>
                    ) : null}
                  </td>
                  <td className="px-2 py-1.5 text-muted-foreground">{row.status}</td>
                  <td className="px-2 py-1.5 text-muted-foreground">{row.duration}</td>
                  <td className="max-w-[180px] truncate px-2 py-1.5 text-muted-foreground" title={row.tool}>
                    {row.tool}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5 text-muted-foreground">{row.time}</td>
                  <td className="px-2 py-1 text-right">
                    {row.showActions ? (
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-[11px]"
                          onClick={() => setOpenStepOutput(row.step)}
                        >
                          View output
                        </Button>
                        <ConfirmActionDialog
                          title={`Rerun ${row.step}?`}
                          description="This will rerun this step and continue downstream MCP steps in the same run."
                          triggerLabel="Rerun"
                          triggerDisabled={row.disableRerun}
                          triggerTitle={row.rerunTooltip}
                          pending={rerunPending}
                          confirmLabel="Start rerun"
                          onConfirm={() => onRerunStep?.(row.step)}
                        />
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-2 py-1.5">
                    <div className="max-w-[280px] space-y-0.5 text-[10px]">
                      {row.failureCode ? <p className="text-destructive">{row.failureCode}</p> : null}
                      {row.hint ? <p className="truncate text-amber-600" title={row.hint}>{row.hint}</p> : null}
                      {!row.failureCode && !row.hint ? <span className="text-muted-foreground">—</span> : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      <Dialog open={!!stepOutput} onOpenChange={(open) => !open && setOpenStepOutput(null)}>
        <DialogContent className="max-h-[85vh] max-w-5xl overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {stepOutput?.step ? `${stepOutput.step} output` : "Step output"}
            </DialogTitle>
          </DialogHeader>
          {stepOutput ? (
            <div className="space-y-4 overflow-y-auto pr-1 text-sm">
              <div className="grid grid-cols-2 gap-3 text-xs md:grid-cols-4">
                <div className="rounded-md border border-border/50 bg-muted/20 p-3">
                  <p className="text-muted-foreground">Latest status</p>
                  <p className="mt-1 font-medium text-foreground">{stepOutput.latest.status}</p>
                </div>
                <div className="rounded-md border border-border/50 bg-muted/20 p-3">
                  <p className="text-muted-foreground">Tool</p>
                  <p className="mt-1 font-medium text-foreground">{stepOutput.latest.tool}</p>
                </div>
                <div className="rounded-md border border-border/50 bg-muted/20 p-3">
                  <p className="text-muted-foreground">Duration</p>
                  <p className="mt-1 font-medium text-foreground">{stepOutput.latest.duration}</p>
                </div>
                <div className="rounded-md border border-border/50 bg-muted/20 p-3">
                  <p className="text-muted-foreground">Attempts</p>
                  <p className="mt-1 font-medium text-foreground">{stepOutput.attempts}</p>
                </div>
              </div>

              {stepOutput.latest.summary ? (
                <div className="rounded-md border border-border/50 bg-muted/15 p-3">
                  <p className="mb-2 text-xs font-semibold tracking-wide text-foreground">Summary</p>
                  <div className="max-h-[260px] overflow-auto rounded bg-background/60 p-3">
                    <p className="whitespace-pre-wrap text-xs leading-relaxed text-foreground">
                      {stepOutput.latest.summary}
                    </p>
                  </div>
                </div>
              ) : null}

              <div className="max-h-[320px] overflow-auto rounded-md border border-border/50">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-muted/70 text-muted-foreground backdrop-blur">
                    <tr>
                      <th className="px-2 py-1.5 text-left font-medium">Event</th>
                      <th className="px-2 py-1.5 text-left font-medium">Status</th>
                      <th className="px-2 py-1.5 text-left font-medium">Time</th>
                      <th className="px-2 py-1.5 text-left font-medium">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stepOutput.rows.map((row) => (
                      <tr key={row.id} className="border-t border-border/40 align-top">
                        <td className="px-2 py-1.5 font-medium text-foreground">{row.eventName}</td>
                        <td className="px-2 py-1.5 text-muted-foreground">{row.status}</td>
                        <td className="whitespace-nowrap px-2 py-1.5 text-muted-foreground">{row.time}</td>
                        <td className="px-2 py-1.5">
                          <div className="space-y-1.5 text-[11px] text-muted-foreground">
                            {row.hint ? <p><span className="font-medium text-foreground">Hint:</span> {row.hint}</p> : null}
                            {row.failureCode ? <p><span className="font-medium text-foreground">Failure code:</span> {row.failureCode}</p> : null}
                            {row.stage ? <p><span className="font-medium text-foreground">Stage:</span> {row.stage}</p> : null}
                            {typeof row.artifactCount === "number" ? (
                              <p><span className="font-medium text-foreground">Artifacts:</span> {row.artifactCount}</p>
                            ) : null}
                            <p><span className="font-medium text-foreground">Tool:</span> {row.tool}</p>
                            <p><span className="font-medium text-foreground">Duration:</span> {row.duration}</p>
                            {row.attemptNo && row.attemptNo > 1 ? (
                              <p><span className="font-medium text-foreground">Attempt:</span> {row.attemptNo}</p>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No output available for this step.</p>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
