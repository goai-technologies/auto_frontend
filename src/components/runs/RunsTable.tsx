import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDateTime } from "@/lib/format";
import type { RunsListItem } from "@/lib/api/types";

export function RunsTable({ runs }: { runs: RunsListItem[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border/40 text-muted-foreground">
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
        {runs.map((run) => (
          <tr key={run.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
            <td className="p-3">
              <Link to={`/runs/${encodeURIComponent(run.id)}`} className="font-mono text-xs text-primary hover:underline">
                {run.id}
              </Link>
            </td>
            <td className="p-3 text-foreground">{run.project_id}</td>
            <td className="p-3 font-mono text-xs text-foreground">{run.original_ticket_key}</td>
            <td className="p-3 font-mono text-xs text-muted-foreground">{run.workflow_type}</td>
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
            <td className="p-3 text-xs text-muted-foreground">{formatDateTime(run.created_at)}</td>
            <td className="p-3 text-xs text-muted-foreground">{run.created_by_user_id}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
