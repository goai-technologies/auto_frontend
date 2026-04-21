import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import type { RunDetail } from "@/lib/api/types";

export function RunSummaryCard({ run }: { run: RunDetail["run"] }) {
  return (
    <Card className="bg-card/80 border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Run Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <p>
          Status: <StatusBadge status={run.status as any} className="ml-1" />
        </p>
        <p>Confidence: {typeof run.confidence_score === "number" ? run.confidence_score.toFixed(2) : "—"}</p>
        <p>Decision: {run.confidence_decision ?? "—"}</p>
        <p>Original ticket: {run.original_ticket_key || "—"}</p>
        <p>Shadow ticket: {run.shadow_ticket_key || "—"}</p>
      </CardContent>
    </Card>
  );
}
