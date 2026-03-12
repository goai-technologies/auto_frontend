import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { mockProjects } from "@/lib/mock-data";
import { getProviderLabel } from "@/lib/format";
import { Play, GitBranch, Ticket } from "lucide-react";
import { toast } from "sonner";

const RunWorkflow = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const project = mockProjects.find((p) => p.project_id === projectId);
  const [ticketUrl, setTicketUrl] = useState("");
  const [branchOverride, setBranchOverride] = useState("");
  const [dryRun, setDryRun] = useState(false);

  if (!project) return <div className="text-muted-foreground">Project not found.</div>;

  const handleRun = () => {
    if (!ticketUrl.trim()) {
      toast.error("Please enter a ticket link or ID");
      return;
    }
    toast.success("Run started!");
    navigate("/runs/run-001");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Run Workflow</h1>
        <p className="text-sm text-muted-foreground mt-1">{project.name}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-card">
          <CardContent className="p-3 flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-primary" />
            <span className="font-mono text-xs text-foreground">
              {project.repo_owner}/{project.repo_name}
            </span>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-3 flex items-center gap-2">
            <Ticket className="h-4 w-4 text-primary" />
            <span className="text-xs text-foreground">
              {getProviderLabel(project.issue_source)} · {project.issue_source_key}
            </span>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-base">Ticket Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Ticket link or ID</Label>
            <Input
              placeholder={
                project.issue_source === "jira"
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
          <Button className="w-full" onClick={handleRun}>
            <Play className="h-4 w-4 mr-1" /> Run Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RunWorkflow;

