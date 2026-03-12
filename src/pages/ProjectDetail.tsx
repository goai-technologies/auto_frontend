import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { mockProjects, mockRuns } from "@/lib/mock-data";
import { formatDateTime, getProviderLabel } from "@/lib/format";
import { Play, Timer, ExternalLink, GitBranch, Ticket } from "lucide-react";

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const project = mockProjects.find((p) => p.project_id === projectId);
  const projectRuns = mockRuns.filter((r) => r.project_id === projectId);

  if (!project) {
    return <div className="text-muted-foreground">Project not found.</div>;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
          <p className="mt-1 font-mono text-sm text-muted-foreground">{project.project_id}</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/projects/${projectId}/run`}>
            <Button size="sm">
              <Play className="h-4 w-4 mr-1" /> Run Workflow
            </Button>
          </Link>
          <Link to={`/projects/${projectId}/autopoll`}>
            <Button variant="outline" size="sm">
              <Timer className="h-4 w-4 mr-1" /> Auto-polling
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Repository</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-primary" />
              <span className="font-mono text-sm text-foreground">
                {project.repo_owner}/{project.repo_name}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Branch: {project.default_branch}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Issue Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Ticket className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground">
                {getProviderLabel(project.issue_source)}
              </span>
              <span className="font-mono text-xs text-muted-foreground">({project.issue_source_key})</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Workflow: {project.default_workflow}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Runs</CardTitle>
        </CardHeader>
        <CardContent>
          {projectRuns.length === 0 ? (
            <p className="text-sm text-muted-foreground">No runs yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left pb-2 font-medium">Issue</th>
                  <th className="text-left pb-2 font-medium">Status</th>
                  <th className="text-left pb-2 font-medium">PR</th>
                  <th className="text-left pb-2 font-medium">Started</th>
                  <th className="text-left pb-2 font-medium">By</th>
                </tr>
              </thead>
              <tbody>
                {projectRuns.map((run) => (
                  <tr key={run.run_id} className="border-b last:border-0">
                    <td className="py-2.5">
                      <Link
                        to={`/runs/${run.run_id}`}
                        className="font-mono text-xs text-primary hover:underline"
                      >
                        {run.issue_key}
                      </Link>
                    </td>
                    <td className="py-2.5">
                      <StatusBadge status={run.status} />
                    </td>
                    <td className="py-2.5">
                      {run.pr_url ? (
                        <a
                          href={run.pr_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                        >
                          Open <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-2.5 text-xs text-muted-foreground">
                      {formatDateTime(run.started_at)}
                    </td>
                    <td className="py-2.5 text-xs text-muted-foreground">{run.initiated_by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetail;

