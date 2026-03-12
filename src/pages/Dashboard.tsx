import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { mockTenant, mockProjects, mockRuns, mockIntegrations } from "@/lib/mock-data";
import { formatDateTime, getProviderLabel } from "@/lib/format";
import { GitBranch, ExternalLink, CheckCircle, XCircle, Activity } from "lucide-react";

const Dashboard = () => {
  const recentRuns = mockRuns.slice(0, 5);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{mockTenant.name}</h1>
        <p className="text-sm text-muted-foreground">Tenant overview and recent activity</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {mockIntegrations.map((int) => (
          <Card key={int.provider} className="bg-card/80 backdrop-blur-sm border-border/60 shadow-sm">
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    int.connected ? "bg-success/15" : "bg-muted"
                  }`}
                >
                  {int.connected ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{getProviderLabel(int.provider)}</p>
                  <p className="text-xs text-muted-foreground">
                    {int.connected ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              <Link to="/integrations">
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}

        <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">
                <GitBranch className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockProjects.length}</p>
                <p className="text-xs text-muted-foreground">Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/15">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockRuns.filter((r) => r.status === "success").length}
                </p>
                <p className="text-xs text-muted-foreground">Successful runs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-info/15">
                <Activity className="h-4 w-4 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockRuns.filter((r) => r.status === "running").length}
                </p>
                <p className="text-xs text-muted-foreground">Active runs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Recent Runs</CardTitle>
            <Link to="/activity">
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left pb-2 font-medium">Issue</th>
                  <th className="text-left pb-2 font-medium">Project</th>
                  <th className="text-left pb-2 font-medium">Status</th>
                  <th className="text-left pb-2 font-medium">PR</th>
                  <th className="text-left pb-2 font-medium">Started</th>
                </tr>
              </thead>
              <tbody>
                {recentRuns.map((run) => (
                  <tr key={run.run_id} className="border-b last:border-0">
                    <td className="py-2.5">
                      <Link
                        to={`/runs/${run.run_id}`}
                        className="font-mono text-xs text-primary hover:underline"
                      >
                        {run.issue_key}
                      </Link>
                    </td>
                    <td className="py-2.5 text-foreground">{run.project_id}</td>
                    <td className="py-2.5">
                      <StatusBadge status={run.status} />
                    </td>
                    <td className="py-2.5">
                      {run.pr_url ? (
                        <a
                          href={run.pr_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline text-xs"
                        >
                          Open <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                    <td className="py-2.5 text-xs text-muted-foreground">{formatDateTime(run.started_at)}</td>
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

export default Dashboard;

