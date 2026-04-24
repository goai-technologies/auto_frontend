import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import type { RunDetail } from "@/lib/api/types";

export function RunSummaryCard({ run }: { run: RunDetail["run"] }) {
  const rows = [
    {
      label: "Status",
      value: <StatusBadge status={run.status as any} className="text-[11px]" />,
    },
    {
      label: "Confidence",
      value: typeof run.confidence_score === "number" ? run.confidence_score.toFixed(2) : "—",
    },
    {
      label: "Decision",
      value: run.confidence_decision ?? "—",
    },
    {
      label: "Original",
      value: run.original_ticket_key || "—",
    },
    {
      label: "Shadow",
      value: run.shadow_ticket_key || "—",
    },
  ];

  return (
    <Card className="bg-card/80 border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Run Summary</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 gap-x-4 gap-y-1.5 text-xs sm:grid-cols-2">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between rounded-md border border-border/40 px-2 py-1.5">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-medium text-foreground">{row.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
