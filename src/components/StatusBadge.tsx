import { cn } from "@/lib/utils";
import { getStatusColor } from "@/lib/format";

type Status =
  | "queued"
  | "running"
  | "success"
  | "failed"
  | "cancelled"
  | "succeeded"
  | "skipped"
  | "rejected"
  | "needs_manual_action";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        getStatusColor(status),
        className,
      )}
    >
      {status === "running" && <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse-soft" />}
      {status === "success" && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {status === "succeeded" && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {status === "failed" && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {status === "rejected" && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {status === "needs_manual_action" && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {status}
    </span>
  );
}

