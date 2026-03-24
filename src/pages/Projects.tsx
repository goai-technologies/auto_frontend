import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getProviderLabel } from "@/lib/format";
import { Plus, Play, Timer, Eye } from "lucide-react";
import { createProject, listProjects } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const Projects = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: listProjects,
  });

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [repoOwner, setRepoOwner] = useState("");
  const [repoNameOrUrl, setRepoNameOrUrl] = useState("");
  const [defaultBranch, setDefaultBranch] = useState("main");
  const [issueProvider, setIssueProvider] = useState<"jira" | "linear">("jira");
  const [issueKey, setIssueKey] = useState("");

  const mutation = useMutation({
    mutationFn: () => {
      const repoInput = repoNameOrUrl.trim();
      if (!repoInput) {
        throw new Error("Repository link is required");
      }

      let owner = repoOwner.trim();
      let name = repoInput;

      try {
        const url = new URL(repoInput.startsWith("http") ? repoInput : `https://${repoInput}`);
        const parts = url.pathname.split("/").filter(Boolean);
        if (parts.length >= 2) {
          owner = owner || parts[parts.length - 2];
          name = parts[parts.length - 1];
        }
      } catch {
        // If parsing fails, fall back to treating input as repo name
      }

      return createProject({
        project_id: projectId || undefined,
        name,
        repo: {
          provider: "github",
          owner,
          name,
          default_branch: defaultBranch,
        },
        issue_source: {
          provider: issueProvider,
          project_key: issueKey,
        },
        default_workflow: issueProvider === "jira" ? "jira-to-pr" : "linear-to-pr",
      });
    },
    onSuccess: () => {
      toast({ title: "Project created" });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setOpen(false);
    },
    onError: (err: any) => {
      toast({ title: "Failed to create project", description: err?.message });
    },
  });

  if (isLoading || !data) {
    return <div className="text-sm text-muted-foreground">Loading projects…</div>;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your ticket → PR project mappings
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" /> Add Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Payments Service" />
              </div>
              <div className="space-y-2">
                <Label>Project ID (optional)</Label>
                <Input value={projectId} onChange={(e) => setProjectId(e.target.value)} placeholder="payments-service" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Repo owner (optional)</Label>
                  <Input value={repoOwner} onChange={(e) => setRepoOwner(e.target.value)} placeholder="abc-corp" />
                </div>
                <div className="space-y-2">
                  <Label>Repository link (required)</Label>
                  <Input
                    value={repoNameOrUrl}
                    onChange={(e) => setRepoNameOrUrl(e.target.value)}
                    placeholder="https://github.com/abc-corp/payments-service"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Default branch</Label>
                <Input value={defaultBranch} onChange={(e) => setDefaultBranch(e.target.value)} placeholder="main" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Issue provider</Label>
                  <select
                    className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                    value={issueProvider}
                    onChange={(e) => setIssueProvider(e.target.value as "jira" | "linear")}
                  >
                    <option value="jira">Jira</option>
                    <option value="linear">Linear</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>{issueProvider === "jira" ? "Project key" : "Team key"}</Label>
                  <Input
                    value={issueKey}
                    onChange={(e) => setIssueKey(e.target.value)}
                    placeholder={issueProvider === "jira" ? "PAY" : "ENG"}
                  />
                </div>
              </div>
              <Button className="w-full" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
                {mutation.isPending ? "Creating…" : "Create project"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Repository</th>
                  <th className="text-left p-3 font-medium">Issue Source</th>
                  <th className="text-left p-3 font-medium">Workflow</th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((project) => (
                  <tr
                    key={project.project_id}
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-3">
                      <div>
                        <p className="font-medium text-foreground">{project.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {project.project_id}
                        </p>
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="font-mono text-xs text-foreground">
                        {project.repo_owner}/{project.repo_name}
                      </p>
                      <p className="text-xs text-muted-foreground">{project.default_branch}</p>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                        {getProviderLabel(project.issue_provider)} · {project.issue_project_key_or_team}
                      </span>
                    </td>
                    <td className="p-3 text-xs font-mono text-muted-foreground">
                      {project.default_workflow}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/projects/${project.project_id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="View">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <Link to={`/projects/${project.project_id}/run`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Run workflow"
                          >
                            <Play className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <Link to={`/projects/${project.project_id}/autopoll`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Auto-polling"
                          >
                            <Timer className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Projects;

