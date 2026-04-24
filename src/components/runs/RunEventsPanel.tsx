import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RunEvent } from "@/lib/api/types";

export function RunEventsPanel({ events }: { events: RunEvent[] }) {
  return (
    <Card className="bg-card/80 border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Events</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[260px] space-y-1.5 overflow-y-auto pt-0">
        {events.map((event) => (
          <div key={event.id} className="rounded-md border border-border/50 p-1.5">
            <p className="text-[11px] text-foreground">{event.message || event.event_type}</p>
            <pre className="mt-0.5 whitespace-pre-wrap text-[10px] text-muted-foreground">
              {typeof event.payload_json === "string" ? event.payload_json : JSON.stringify(event.payload_json)}
            </pre>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
