import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { mockRuns, mockRunEvents } from "@/lib/mock-data";
import { formatDateTime, formatTime } from "@/lib/format";
import { ExternalLink, ArrowLeft, RefreshCw } from "lucide-react";

const levelColors: Record<string, string> = {
  info: "text-info",
  warn: "text-warning",
  error: "text-destructive",
  debug: "text-muted-foreground",
};

const stepLabels: Record<string, string> = {
  init: "Init",
  prd_lite: "PRD Lite",
  repo_navigator: "Repo Navigator",
  impl_plan: "Implementation Plan",
  implementation: "Implementation",
  ac_check: "AC Check",
  qa: "QA",
  pr_creation: "PR Creation",
};

const RunDetail = () => {
  const { runId } = useParams<{ runId: string }>();
  const run = mockRuns.find((r) => r.run_id === runId);

  if (!run) return <div className="text-muted-foreground">Run not found.</div>;

  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full max-w-4xl flex-col gap-6">
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={`/projects/${run.project_id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-mono text-foreground">{run.issue_key}</h1>
              <StatusBadge status={run.status} />
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {run.project_id} · {run.workflow} · {formatDateTime(run.started_at)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {run.pr_url && (
            <a href={run.pr_url} target="_blank" rel="noopener noreferrer">
              <Button size="sm">
                <ExternalLink className="h-4 w-4 mr-1" /> Open PR
              </Button>
            </a>
          )}
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </Button>
        </div>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Run Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[500px] space-y-1 overflow-y-auto rounded-lg border bg-background p-4 font-mono text-xs">
              {mockRunEvents.map((event, i) => (
                <div key={i} className="flex gap-3 leading-relaxed">
                  <span className="shrink-0 text-muted-foreground">
                    {formatTime(event.timestamp)}
                  </span>
                  <span className={`shrink-0 w-12 text-right ${levelColors[event.level]}`}>
                    [{event.level}]
                  </span>
                  <span className="shrink-0 min-w-[120px] text-primary">
                    {stepLabels[event.step] || event.step}
                  </span>
                  <span className="text-foreground">{event.message}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RunDetail;

