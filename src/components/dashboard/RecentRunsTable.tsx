import { Link } from "react-router-dom";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDateTime } from "@/lib/format";
import type { DashboardSummary } from "@/lib/api/types";

export function RecentRunsTable({ runs }: { runs: DashboardSummary["recent_runs"] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border/40 text-muted-foreground">
          <th className="text-left pb-2 font-medium">Run</th>
          <th className="text-left pb-2 font-medium">Ticket</th>
          <th className="text-left pb-2 font-medium">Workflow</th>
          <th className="text-left pb-2 font-medium">Status</th>
          <th className="text-left pb-2 font-medium">Started</th>
        </tr>
      </thead>
      <tbody>
        {runs.map((run) => (
          <tr key={run.id} className="border-b border-border/30 last:border-0">
            <td className="py-2.5">
              <Link to={`/runs/${encodeURIComponent(run.id)}`} className="font-mono text-xs text-primary hover:underline">
                {run.id}
              </Link>
            </td>
            <td className="py-2.5 text-xs font-mono text-foreground">{run.original_ticket_key}</td>
            <td className="py-2.5 text-xs text-muted-foreground">{run.workflow_type}</td>
            <td className="py-2.5">
              <StatusBadge status={run.status as any} />
            </td>
            <td className="py-2.5 text-xs text-muted-foreground">{formatDateTime(run.created_at)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
