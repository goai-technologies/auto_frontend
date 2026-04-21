import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function WebhookSubscriptionDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: {
    project_id: string;
    provider: string;
    event_types: string[];
    filters: Record<string, unknown>;
    auto_trigger: boolean;
    secret: string;
  }) => void;
}) {
  const [projectId, setProjectId] = useState("");
  const [provider, setProvider] = useState("jira");
  const [eventType, setEventType] = useState("jira:issue_created");
  const [secret, setSecret] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Webhook Subscription</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Project ID</Label>
            <Input value={projectId} onChange={(e) => setProjectId(e.target.value)} placeholder="proj-1" />
          </div>
          <div className="space-y-1">
            <Label>Provider</Label>
            <Input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="jira" />
          </div>
          <div className="space-y-1">
            <Label>Event Type</Label>
            <Input value={eventType} onChange={(e) => setEventType(e.target.value)} placeholder="jira:issue_created" />
          </div>
          <div className="space-y-1">
            <Label>Secret (required)</Label>
            <Input type="password" value={secret} onChange={(e) => setSecret(e.target.value)} />
          </div>
          <Button
            onClick={() =>
              onSubmit({
                project_id: projectId,
                provider,
                event_types: [eventType],
                filters: {},
                auto_trigger: true,
                secret,
              })
            }
          >
            Save subscription
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
