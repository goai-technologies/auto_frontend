import { RunStatus } from "@/lib/mock-data";

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

export function getStatusColor(status: RunStatus) {
  switch (status) {
    case "success":
      return "bg-success/15 text-success";
    case "running":
      return "bg-info/15 text-info";
    case "failed":
      return "bg-destructive/15 text-destructive";
    case "queued":
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

