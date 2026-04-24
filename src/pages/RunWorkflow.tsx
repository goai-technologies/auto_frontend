import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getProviderLabel } from "@/lib/format";
import { Play, GitBranch, Ticket } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api/client";
import { getProject } from "@/lib/api/projects";
import { listRuns, startRun } from "@/lib/api/runs";

function extractIssueKey(input: string): string | undefined {
  const match = input.match(/([A-Z][A-Z0-9_]+-\d+)/i);
  return match?.[1]?.toUpperCase();
}

const RunWorkflow = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [ticketUrl, setTicketUrl] = useState("");
  const [branchOverride, setBranchOverride] = useState("");
  const [dryRun, setDryRun] = useState(false);
  const [resolvedIssueKey, setResolvedIssueKey] = useState<string | undefined>();
  const [queuedRun, setQueuedRun] = useState(false);
  const [queuedAtMs, setQueuedAtMs] = useState<number | undefined>();

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId!),
    enabled: !!projectId,
  });

  const mutation = useMutation({
    mutationFn: () => {
      const input = ticketUrl.trim();
      let cleanedTicketUrl: string | undefined;
      let issueKey: string | undefined;

      if (!input) {
        throw new Error("Please enter a ticket link or ID");
      }

      // Case 1: URL with ?selectedIssue=GOAI-20
      if (input.includes("selectedIssue=")) {
        try {
          const url = new URL(input.startsWith("http") ? input : `https://${input}`);
          const selected = url.searchParams.get("selectedIssue") || undefined;
          if (selected) {
            issueKey = selected.toUpperCase();
          }
          cleanedTicketUrl = url.toString();
        } catch {
          // Fallback: extract after selectedIssue=
          issueKey = extractIssueKey(input);
        }
      } else if (input.startsWith("http")) {
        // Case 2: direct Jira/Linear issue URL
        cleanedTicketUrl = input;
        issueKey = extractIssueKey(input);
      } else {
        // Case 3: plain issue key like GOAI-20
        issueKey = input.toUpperCase();
      }

      setResolvedIssueKey(issueKey);
      return startRun(projectId!, {
        ticket_url: cleanedTicketUrl,
        issue_key: issueKey,
        initiated_by_id: "ui",
      });
    },
    onSuccess: (data) => {
      if (data.queued) {
        toast({
          title: "Run queued",
          description: "Another run is active. We will start this run as soon as the lock is available.",
        });
        setQueuedRun(true);
        setQueuedAtMs(Date.now());
        return;
      }
      if (!data.run_id && !data.queued) {
        toast({
          title: "Unable to start run",
          description: "Backend did not return a run id.",
        });
        setQueuedRun(false);
        return;
      }
      if (data.status === "rejected") {
        toast({
          title: "Run rejected by confidence gate",
          description: "This run was stopped automatically because confidence was below 0.80.",
        });
      } else {
        toast({ title: "Run started" });
      }
      if (data.run_id) {
        setQueuedRun(false);
        setQueuedAtMs(undefined);
        navigate(`/runs/${encodeURIComponent(data.run_id)}`);
      }
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError && err.status === 409) {
        toast({
          title: "Run already active",
          description: "Another run is already active for this project/repository.",
        });
        return;
      }
      if (err instanceof ApiError && err.status === 403) {
        toast({ title: "Insufficient permissions", description: "You are not allowed to trigger runs for this project." });
        return;
      }
      toast({ title: "Run failed", description: err instanceof Error ? err.message : "Unknown error" });
    },
  });

  const queuedRunsQuery = useQuery({
    queryKey: ["runs", "queued-check", projectId, resolvedIssueKey, queuedAtMs],
    queryFn: () =>
      listRuns({
        project_id: projectId,
        page: 1,
        page_size: 10,
        q: resolvedIssueKey,
        sort_by: "created_at",
        sort_order: "desc",
      }),
    enabled: !!projectId && queuedRun,
    refetchInterval: 3000,
  });

  const matchedRunId = useMemo(() => {
    const items = queuedRunsQuery.data?.items ?? [];
    if (!items.length || !resolvedIssueKey) return undefined;

    const lowerIssueKey = resolvedIssueKey.toLowerCase();
    const triggerWindowStart = queuedAtMs ? queuedAtMs - 5000 : undefined;
    const exact = items.find((r) => {
      const original = r.original_ticket_key?.toLowerCase?.() ?? "";
      const shadow = r.shadow_ticket_key?.toLowerCase?.() ?? "";
      const createdAtMs = Date.parse(r.created_at);
      const afterQueuedAt = triggerWindowStart ? createdAtMs >= triggerWindowStart : true;
      return afterQueuedAt && (original === lowerIssueKey || shadow === lowerIssueKey);
    });
    if (exact?.id) {
      return exact.id;
    }
    return undefined;
  }, [queuedRunsQuery.data?.items, resolvedIssueKey, queuedAtMs]);

  useEffect(() => {
    if (!queuedRun || !matchedRunId) return;
    setQueuedRun(false);
    setQueuedAtMs(undefined);
    toast({ title: "Run started from queue", description: "Opening run detail..." });
    navigate(`/runs/${encodeURIComponent(matchedRunId)}`);
  }, [queuedRun, matchedRunId, navigate]);

  if (isLoading || !project) return <div className="text-muted-foreground">Project not found.</div>;

  const handleRun = () => {
    if (!ticketUrl.trim()) {
      toast({ title: "Please enter a ticket link or ID" });
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Run Workflow</h1>
          <p className="mt-1 text-sm text-muted-foreground">{project.name}</p>
          {queuedRun && (
            <p className="mt-1 text-xs text-amber-600">
              Run is queued. Waiting for active lock to clear and polling recent runs...
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-sm">
            <CardContent className="flex items-center gap-2 p-3">
              <GitBranch className="h-4 w-4 text-primary" />
              <span className="font-mono text-xs text-foreground">
                {project.repo_owner}/{project.repo_name}
              </span>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-sm">
            <CardContent className="flex items-center gap-2 p-3">
              <Ticket className="h-4 w-4 text-primary" />
              <span className="text-xs text-foreground">
                {getProviderLabel(project.ticket_source_type)} · {project.ticket_source_project_key}
              </span>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Ticket Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Ticket link or ID</Label>
              <Input
                placeholder={
                  project.ticket_source_type === "jira"
                    ? "PAY-123 or https://abc.atlassian.net/browse/PAY-123"
                    : "ANA-12 or Linear issue URL"
                }
                value={ticketUrl}
                onChange={(e) => setTicketUrl(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label>Branch override (optional)</Label>
              <Input
                placeholder={project.repo_default_branch}
                value={branchOverride}
                onChange={(e) => setBranchOverride(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted p-3">
              <div>
                <p className="text-sm font-medium text-foreground">Dry run</p>
                <p className="text-xs text-muted-foreground">Generate plan without creating PR</p>
              </div>
              <Switch checked={dryRun} onCheckedChange={setDryRun} />
            </div>
            <Button className="w-full" onClick={handleRun} disabled={mutation.isPending}>
              <Play className="h-4 w-4 mr-1" /> {mutation.isPending ? "Running…" : "Run Now"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RunWorkflow;

