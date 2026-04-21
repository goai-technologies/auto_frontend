import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHealth, useReadiness, useSystemHealth } from "@/hooks/api/useSystem";

function resolveStatusLabel(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const payload = value as Record<string, unknown>;

  if (typeof payload.status === "string" && payload.status.trim()) {
    return payload.status;
  }
  if (typeof payload.ready === "boolean") {
    return payload.ready ? "ready" : "degraded";
  }
  if (typeof payload.healthy === "boolean") {
    return payload.healthy ? "healthy" : "degraded";
  }
  if (typeof payload.ok === "boolean") {
    return payload.ok ? "ok" : "degraded";
  }
  return null;
}

export function SystemHealthCard() {
  const health = useHealth();
  const ready = useReadiness();
  const detail = useSystemHealth();

  const liveness = resolveStatusLabel(health.data);
  const readiness = resolveStatusLabel(ready.data);
  const detailStatus = resolveStatusLabel(detail.data);

  // Show this widget only when all values are definitive.
  if (!liveness || !readiness || !detailStatus) {
    return null;
  }

  return (
    <Card className="bg-card/80 border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">System Health</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>Liveness: {liveness}</p>
        <p>Readiness: {readiness}</p>
        <p>Detail: {detailStatus}</p>
      </CardContent>
    </Card>
  );
}
