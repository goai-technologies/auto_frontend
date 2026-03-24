import { useState } from "react";
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
import { getProject, startRun } from "@/lib/api";

const RunWorkflow = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [ticketUrl, setTicketUrl] = useState("");
  const [branchOverride, setBranchOverride] = useState("");
  const [dryRun, setDryRun] = useState(false);

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
            issueKey = selected;
          }
          cleanedTicketUrl = url.toString();
        } catch {
          // Fallback: extract after selectedIssue=
          const match = input.match(/selectedIssue=([A-Z][A-Z0-9_]+-\d+)/i);
          if (match) {
            issueKey = match[1];
          }
        }
      } else if (input.startsWith("http")) {
        // Case 2: direct Jira/Linear issue URL
        cleanedTicketUrl = input;
      } else {
        // Case 3: plain issue key like GOAI-20
        issueKey = input;
      }

      return startRun(projectId!, {
        ticket_url: cleanedTicketUrl,
        issue_key: issueKey,
        initiated_by_id: "ui",
      });
    },
    onSuccess: (data) => {
      toast({ title: "Run started" });
      navigate(`/runs/${encodeURIComponent(data.run_id)}`);
    },
    onError: (err: any) => {
      toast({ title: "Run failed", description: err?.message });
    },
  });

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
                {getProviderLabel(project.issue_provider)} · {project.issue_project_key_or_team}
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
                  project.issue_provider === "jira"
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
                placeholder={project.default_branch}
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

