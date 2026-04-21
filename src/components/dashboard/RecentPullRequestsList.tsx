import { ExternalLink } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import type { DashboardSummary } from "@/lib/api/types";

export function RecentPullRequestsList({ prs }: { prs: DashboardSummary["recent_pull_requests"] }) {
  return (
    <div className="space-y-2">
      {prs.map((pr) => (
        <div key={pr.id} className="flex items-center justify-between rounded-md border border-border/60 p-2">
          <div className="min-w-0">
            <p className="font-mono text-xs text-foreground">{pr.id}</p>
            <p className="text-xs text-muted-foreground">{formatDateTime(pr.created_at)}</p>
          </div>
          <a href={pr.pr_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
            Open PR <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      ))}
    </div>
  );
}
