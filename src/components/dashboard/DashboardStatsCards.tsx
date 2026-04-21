import { Card, CardContent } from "@/components/ui/card";
import { Activity, CheckCircle, GitBranch, AlertTriangle } from "lucide-react";
import type { DashboardSummary } from "@/lib/api/types";

export function DashboardStatsCards({ stats }: { stats: DashboardSummary["stats"] }) {
  const items = [
    { label: "Projects", value: stats.projects_total, icon: GitBranch, cls: "bg-primary/15 text-primary" },
    { label: "Successful runs", value: stats.runs_successful, icon: CheckCircle, cls: "bg-success/15 text-success" },
    { label: "Active runs", value: stats.runs_active, icon: Activity, cls: "bg-info/15 text-info" },
    { label: "Unhealthy integrations", value: stats.integrations_unhealthy, icon: AlertTriangle, cls: "bg-warning/15 text-warning" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="bg-card/80 border-border/60 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.cls}`}>
                <item.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
