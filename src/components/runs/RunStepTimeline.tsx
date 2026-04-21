import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RunEvent } from "@/lib/api/types";

export function RunStepTimeline({ events }: { events: RunEvent[] }) {
  return (
    <Card className="bg-card/80 border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Step Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {events.map((event) => (
          <div key={event.id} className="rounded-md border border-border/50 p-2 text-xs">
            <p className="font-medium text-foreground">{event.event_type}</p>
            <p className="text-muted-foreground">{event.created_at}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
