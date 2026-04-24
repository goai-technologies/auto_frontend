export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function formatDateTime(dateStr: string): string {
  return `${formatDate(dateStr)} ${formatTime(dateStr)}`;
}

export function getStatusColor(
  status:
    | "queued"
    | "running"
    | "success"
    | "failed"
    | "cancelled"
    | "succeeded"
    | "skipped"
    | "rejected"
    | "needs_manual_action",
) {
  switch (status) {
    case "succeeded":
      return "bg-success/20 text-success";
    case "success":
      return "bg-success/20 text-success";
    case "running":
      return "bg-info/15 text-info";
    case "failed":
    case "rejected":
    case "needs_manual_action":
      return "bg-destructive/20 text-destructive";
    case "queued":
    case "skipped":
      return "bg-muted text-muted-foreground";
    case "cancelled":
      return "bg-muted text-muted-foreground";
  }
}

export function getProviderLabel(provider: string) {
  switch (provider) {
    case "github":
      return "GitHub";
    case "jira":
      return "Jira";
    case "linear":
      return "Linear";
    default:
      return provider;
  }
}

