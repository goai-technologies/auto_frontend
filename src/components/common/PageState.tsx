import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PageState({
  loading,
  error,
  empty,
  emptyMessage,
  onRetry,
  children,
}: {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
  children: JSX.Element;
}) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading...
      </div>
    );
  }
  if (error) {
    const isForbidden = error.toLowerCase().includes("permission") || error.toLowerCase().includes("forbidden");
    return (
      <div className="space-y-2">
        <p className={`text-sm ${isForbidden ? "text-warning" : "text-destructive"}`}>{error}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        )}
      </div>
    );
  }
  if (empty) {
    return <p className="text-sm text-muted-foreground">{emptyMessage ?? "No data available."}</p>;
  }
  return children;
}
