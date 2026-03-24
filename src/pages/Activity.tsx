import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDateTime } from "@/lib/format";
import { ExternalLink } from "lucide-react";
import { listProjects, listRuns, RunRow } from "@/lib/api";

const ActivityPage = () => {
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: listProjects,
  });

  const { data: runs } = useQuery({
    queryKey: ["runs", { projectFilter, statusFilter }],
    queryFn: () =>
      listRuns({
        project_id: projectFilter !== "all" ? projectFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      }),
  });

  const filtered: RunRow[] = runs ?? [];

  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Activity</h1>
        <p className="mt-1 text-sm text-muted-foreground">All workflow runs across projects</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All projects</SelectItem>
            {projects?.map((p) => (
              <SelectItem key={p.project_id} value={p.project_id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {["queued", "running", "succeeded", "failed", "skipped"].map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left p-3 font-medium">Run</th>
                  <th className="text-left p-3 font-medium">Project</th>
                  <th className="text-left p-3 font-medium">Issue</th>
                  <th className="text-left p-3 font-medium">Workflow</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">PR</th>
                  <th className="text-left p-3 font-medium">Started</th>
                  <th className="text-left p-3 font-medium">By</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((run) => (
                  <tr key={run.run_id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <Link
                        to={`/runs/${encodeURIComponent(run.run_id)}`}
                        className="font-mono text-xs text-primary hover:underline"
                      >
                        {run.run_id}
                      </Link>
                    </td>
                    <td className="p-3 text-foreground">{run.project_id}</td>
                    <td className="p-3 font-mono text-xs text-foreground">{run.issue_key_or_id}</td>
                    <td className="p-3 font-mono text-xs text-muted-foreground">{run.workflow}</td>
                    <td className="p-3">
                      <StatusBadge status={run.status as any} />
                    </td>
                    <td className="p-3">
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
                    <td className="p3 text-xs text-muted-foreground">{formatDateTime(run.created_at)}</td>
                    <td className="p-3 text-xs text-muted-foreground">{run.initiated_by_id}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-muted-foreground">
                      No runs match filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityPage;

