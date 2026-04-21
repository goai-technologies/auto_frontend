import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { ArrowLeft, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useRunDetail, useRunEvents, useRerunRun, useRerunStep } from "@/hooks/api/useRuns";
import { PageState } from "@/components/common/PageState";
import { ConfirmActionDialog } from "@/components/common/ConfirmActionDialog";
import { RunSummaryCard } from "@/components/runs/RunSummaryCard";
import { RunStepTimeline } from "@/components/runs/RunStepTimeline";
import { RunEventsPanel } from "@/components/runs/RunEventsPanel";
import { RunArtifactsPanel } from "@/components/runs/RunArtifactsPanel";
import { ArtifactViewer } from "@/components/runs/ArtifactViewer";
import { useArtifactDetail, useRunArtifacts } from "@/hooks/api/useArtifacts";

const RunDetail = () => {
  const { runId } = useParams<{ runId: string }>();
  const decodedRunId = runId ? decodeURIComponent(runId) : undefined;
  const runQuery = useRunDetail(decodedRunId);
  const eventsQuery = useRunEvents(decodedRunId);
  const rerunMutation = useRerunRun(decodedRunId);
  const rerunStepMutation = useRerunStep(decodedRunId);
  const [artifactPage, setArtifactPage] = useState(1);
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | undefined>();
  const artifactsQuery = useRunArtifacts(decodedRunId, { page: artifactPage, page_size: 10 });
  const artifactDetailQuery = useArtifactDetail(decodedRunId, selectedArtifactId);

  const run = runQuery.data?.run;
  const events = useMemo(() => eventsQuery.data ?? runQuery.data?.events ?? [], [eventsQuery.data, runQuery.data?.events]);

  const stepCandidates = useMemo(() => {
    const ids = new Set<string>();
    const rows: string[] = [];
    for (const event of events) {
      const payload = typeof event.payload_json === "object" && event.payload_json !== null ? event.payload_json : {};
      const stepId = (payload as any).step_id;
      if (typeof stepId === "string" && !ids.has(stepId)) {
        ids.add(stepId);
        rows.push(stepId);
      }
    }
    return rows;
  }, [events]);

  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full max-w-6xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/activity">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold font-mono text-foreground">{decodedRunId}</h1>
              <p className="text-xs text-muted-foreground">Run operational detail view</p>
            </div>
          </div>
          <div className="flex gap-2">
            {run?.pr_url && (
              <a href={run.pr_url} target="_blank" rel="noopener noreferrer">
                <Button size="sm">
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
                    toast({ title: "Rerun started" });
                    window.location.assign(`/runs/${encodeURIComponent(data.run_id)}`);
                  })
                  .catch((err: any) => toast({ title: "Rerun failed", description: err?.message }))
              }
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                runQuery.refetch();
                eventsQuery.refetch();
              }}
            >
              <RefreshCw className="mr-1 h-4 w-4" /> Refresh
            </Button>
          </div>
        </div>

        <PageState
          loading={runQuery.isLoading}
          error={runQuery.isError ? "Failed to load run details." : null}
          onRetry={() => runQuery.refetch()}
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {run && <RunSummaryCard run={run} />}
              <RunStepTimeline events={events} />
              <RunEventsPanel events={events} />
            </div>
            <div className="space-y-3">
              <div className="rounded-md border border-border/60 p-3">
                <p className="mb-1 text-xs text-muted-foreground">Ticket Links</p>
                <a href={run?.original_ticket_url || "#"} className="block text-xs text-primary hover:underline">
                  Original: {run?.original_ticket_key || "—"}
                </a>
                <a href={run?.shadow_ticket_url || "#"} className="block text-xs text-primary hover:underline">
                  Shadow: {run?.shadow_ticket_key || "—"}
                </a>
                {run?.status === "rejected" && (
                  <p className="mt-2 text-xs text-destructive">
                    This run was stopped automatically because confidence was below 0.80.
                  </p>
                )}
              </div>
              {stepCandidates.map((stepId) => (
                <ConfirmActionDialog
                  key={stepId}
                  title={`Rerun step ${stepId}?`}
                  triggerLabel={`Rerun ${stepId}`}
                  pending={rerunStepMutation.isPending}
                  onConfirm={() =>
                    rerunStepMutation
                      .mutateAsync({ stepId })
                      .then((result) => toast({ title: "Step rerun completed", description: `Attempt #${result.attempt_no} ${result.status}` }))
                      .catch((err: any) => toast({ title: "Step rerun failed", description: err?.message }))
                  }
                />
              ))}
              <RunArtifactsPanel
                artifacts={artifactsQuery.data?.items ?? []}
                page={artifactsQuery.data?.pagination.page ?? artifactPage}
                totalPages={artifactsQuery.data?.pagination.total_pages ?? 1}
                onPageChange={setArtifactPage}
                onSelect={setSelectedArtifactId}
              />
              {selectedArtifactId && artifactDetailQuery.data && (
                <div className="rounded-md border border-border/60 p-3">
                  <p className="mb-2 text-xs font-medium text-foreground">Artifact detail: {selectedArtifactId}</p>
                  <ArtifactViewer value={artifactDetailQuery.data.content} />
                </div>
              )}
            </div>
          </div>
        </PageState>
      </div>
    </div>
  );
};

export default RunDetail;
