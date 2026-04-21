import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboardSummary } from "@/hooks/api/useDashboard";
import { PageState } from "@/components/common/PageState";
import { EmptyState } from "@/components/common/EmptyState";
import { DashboardStatsCards } from "@/components/dashboard/DashboardStatsCards";
import { RecentRunsTable } from "@/components/dashboard/RecentRunsTable";
import { RecentPullRequestsList } from "@/components/dashboard/RecentPullRequestsList";
import { useAuth } from "@/components/AuthProvider";
import { SystemHealthCard } from "@/components/system/SystemHealthCard";

const Dashboard = () => {
  const query = useDashboardSummary();
  const data = query.data;
  const { role } = useAuth();

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{data?.tenant.name ?? "Dashboard"}</h1>
        <p className="text-sm text-muted-foreground">Tenant overview and recent activity</p>
      </div>

      <PageState
        loading={query.isLoading}
        error={query.isError ? "Failed to load dashboard data." : null}
        onRetry={() => query.refetch()}
      >
        <div className="space-y-6">
          {data ? <DashboardStatsCards stats={data.stats} /> : <EmptyState message="No dashboard data yet." />}
          {role === "admin" && <SystemHealthCard />}

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
              {data?.recent_runs?.length ? <RecentRunsTable runs={data.recent_runs} /> : <EmptyState message="No runs yet." />}
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Recent Pull Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {data?.recent_pull_requests?.length ? (
                <RecentPullRequestsList prs={data.recent_pull_requests} />
              ) : (
                <EmptyState message="No pull requests yet." />
              )}
            </CardContent>
          </Card>
        </div>
      </PageState>
    </div>
  );
};

export default Dashboard;

