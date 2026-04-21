export function IntegrationHealthBadge({ health }: { health?: string }) {
  const value = health ?? "unknown";
  const cls =
    value === "healthy"
      ? "bg-success/20 text-success"
      : value === "unhealthy"
        ? "bg-destructive/20 text-destructive"
        : "bg-muted text-muted-foreground";
  return <span className={`rounded-full px-2 py-0.5 text-[11px] ${cls}`}>{value}</span>;
}
