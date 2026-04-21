import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useProjects, useCreateProject } from "@/hooks/api/useProjects";
import { toast } from "@/hooks/use-toast";
import { ProjectsTable } from "@/components/projects/ProjectsTable";
import { PageState } from "@/components/common/PageState";
import { EmptyState } from "@/components/common/EmptyState";
import { TablePagination } from "@/components/common/TablePagination";
import { useAuth } from "@/components/AuthProvider";

const Projects = () => {
  const { role } = useAuth();
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page") ?? "1");
  const search = params.get("q") ?? "";
  const isActive = params.get("is_active") ?? "all";
  const ticketSourceType = (params.get("ticket_source_type") ?? "all") as "all" | "jira" | "linear";
  const projectsQuery = useProjects({
    page,
    page_size: 20,
    q: search || undefined,
    is_active: isActive === "all" ? undefined : isActive === "true",
    ticket_source_type: ticketSourceType === "all" ? undefined : ticketSourceType,
  });
  const createMutation = useCreateProject();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [repoOwner, setRepoOwner] = useState("");
  const [repoNameOrUrl, setRepoNameOrUrl] = useState("");
  const [defaultBranch, setDefaultBranch] = useState("main");
  const [issueProvider, setIssueProvider] = useState<"jira" | "linear">("jira");
  const [issueKey, setIssueKey] = useState("");

  const handleCreate = () => {
      const repoInput = repoNameOrUrl.trim();
      if (!repoInput) {
        toast({ title: "Repository link is required" });
        return;
      }

      let owner = repoOwner.trim();
      let repoProjectName = repoInput;

      try {
        const url = new URL(repoInput.startsWith("http") ? repoInput : `https://${repoInput}`);
        const parts = url.pathname.split("/").filter(Boolean);
        if (parts.length >= 2) {
          owner = owner || parts[parts.length - 2];
          repoProjectName = parts[parts.length - 1];
        }
      } catch {
        // If parsing fails, fall back to treating input as repo name
      }

      createMutation
        .mutateAsync({
        project_id: projectId || undefined,
        name,
        repo: { owner, name: repoProjectName, default_branch: defaultBranch },
        issue_source: {
          provider: issueProvider,
          project_key: issueKey,
        },
        default_workflow: issueProvider === "jira" ? "jira-to-pr" : "linear-to-pr",
      })
        .then(() => {
          toast({ title: "Project created" });
          setOpen(false);
        })
        .catch((err: any) => toast({ title: "Failed to create project", description: err?.message }));
    };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your ticket → PR project mappings
          </p>
        </div>
        {role === "admin" && (
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
                    <Input value={repoOwner} onChange={(e) => setRepoOwner(e.target.value)} placeholder="acme" />
                  </div>
                  <div className="space-y-2">
                    <Label>Repository link (required)</Label>
                    <Input value={repoNameOrUrl} onChange={(e) => setRepoNameOrUrl(e.target.value)} placeholder="https://github.com/acme/backend" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Default branch</Label>
                  <Input value={defaultBranch} onChange={(e) => setDefaultBranch(e.target.value)} placeholder="main" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Issue provider</Label>
                    <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm" value={issueProvider} onChange={(e) => setIssueProvider(e.target.value as "jira" | "linear")}>
                      <option value="jira">Jira</option>
                      <option value="linear">Linear</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>{issueProvider === "jira" ? "Project key" : "Team key"}</Label>
                    <Input value={issueKey} onChange={(e) => setIssueKey(e.target.value)} placeholder={issueProvider === "jira" ? "PAY" : "ENG"} />
                  </div>
                </div>
                <Button className="w-full" onClick={handleCreate} disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating…" : "Create project"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Input
          value={search}
          onChange={(e) => {
            const next = new URLSearchParams(params);
            if (e.target.value.trim()) next.set("q", e.target.value.trim());
            else next.delete("q");
            next.set("page", "1");
            setParams(next);
          }}
          placeholder="Search projects..."
          className="w-[220px]"
        />
        <select
          className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          value={isActive}
          onChange={(e) => {
            const next = new URLSearchParams(params);
            if (e.target.value === "all") next.delete("is_active");
            else next.set("is_active", e.target.value);
            next.set("page", "1");
            setParams(next);
          }}
        >
          <option value="all">all activity</option>
          <option value="true">active only</option>
          <option value="false">inactive only</option>
        </select>
        <select
          className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          value={ticketSourceType}
          onChange={(e) => {
            const next = new URLSearchParams(params);
            if (e.target.value === "all") next.delete("ticket_source_type");
            else next.set("ticket_source_type", e.target.value);
            next.set("page", "1");
            setParams(next);
          }}
        >
          <option value="all">all sources</option>
          <option value="jira">jira</option>
          <option value="linear">linear</option>
        </select>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-sm">
        <CardContent className="p-0">
          <PageState
            loading={projectsQuery.isLoading}
            error={projectsQuery.isError ? "Failed to load projects." : null}
            onRetry={() => projectsQuery.refetch()}
          >
            <div className="space-y-2">
              <div className="overflow-x-auto">
                {projectsQuery.data?.items?.length ? (
                  <ProjectsTable projects={projectsQuery.data.items} />
                ) : (
                  <EmptyState message="No projects created yet." />
                )}
              </div>
              {projectsQuery.data?.pagination && (
                <TablePagination
                  page={projectsQuery.data.pagination.page}
                  totalPages={projectsQuery.data.pagination.total_pages}
                  onPageChange={(nextPage) => {
                    const next = new URLSearchParams(params);
                    next.set("page", String(nextPage));
                    setParams(next);
                  }}
                />
              )}
            </div>
          </PageState>
        </CardContent>
      </Card>
    </div>
  );
};

export default Projects;

