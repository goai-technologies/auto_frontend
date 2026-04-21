import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { getProviderLabel } from "@/lib/format";
import { Timer, Play, Square } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getProject } from "@/lib/api/projects";
import { getAutoPollRules, upsertAutoPollRule, type AutoPollRuleRow } from "@/lib/api/autopoll";

const AutoPolling = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId!),
    enabled: !!projectId,
  });

  const { data: rules } = useQuery({
    queryKey: ["autopoll-rules", projectId],
    queryFn: () => getAutoPollRules(projectId!),
    enabled: !!projectId,
  });

  const existingRule: AutoPollRuleRow | undefined = rules && rules.length > 0 ? rules[0] : undefined;

  const [active, setActive] = useState(existingRule?.active === "true");
  const [jql, setJql] = useState(existingRule?.jql ?? "");
  const [interval, setIntervalVal] = useState(Number(existingRule?.interval_seconds ?? 60));

  const mutation = useMutation({
    mutationFn: () =>
      upsertAutoPollRule(projectId!, {
        provider: project?.ticket_source_type,
        ...(project?.ticket_source_type === "jira"
          ? { jql }
          : { linear_states: [], linear_assignee: "" }),
        interval_seconds: interval,
        active,
      }),
    onSuccess: () => {
      toast({ title: "Rule saved" });
    },
    onError: (err: any) => {
      toast({ title: "Failed to save rule", description: err?.message });
    },
  });

  if (isLoading || !project) return <div className="text-muted-foreground">Project not found.</div>;

  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Auto-Polling</h1>
          <p className="mt-1 text-sm text-muted-foreground">{project.name}</p>
        </div>

        {existingRule && (
          <Card className="bg-card/80 border-primary/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                    active ? "bg-success/15" : "bg-muted"
                  }`}
                >
                  <Timer className={`h-4 w-4 ${active ? "text-success" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Auto-polling is {active ? "active" : "paused"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Every {interval}s via {getProviderLabel(existingRule.provider)}
                  </p>
                </div>
              </div>
              <Button
                variant={active ? "outline" : "default"}
                size="sm"
                onClick={() => {
                  setActive(!active);
                  toast({ title: active ? "Auto-polling stopped" : "Auto-polling started" });
                }}
              >
                {active ? (
                  <>
                    <Square className="h-3.5 w-3.5 mr-1" /> Stop
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 mr-1" /> Start
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        )}

        <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">{existingRule ? "Edit Rule" : "Create Rule"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {project.ticket_source_type === "jira" ? (
            <div className="space-y-2">
              <Label>JQL Query</Label>
              <Textarea
                placeholder='assignee = currentUser() AND project = PAY AND statusCategory != Done'
                value={jql}
                onChange={(e) => setJql(e.target.value)}
                className="font-mono text-xs min-h-[80px]"
              />
              <p className="text-xs text-muted-foreground">
                Jira Query Language filter for tickets to auto-process
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Assignee User ID (optional)</Label>
                <Input placeholder="Linear user ID" />
              </div>
              <div className="space-y-2">
                <Label>States</Label>
                <Input placeholder="Backlog, Todo, Ready" />
                <p className="text-xs text-muted-foreground">
                  Comma-separated Linear states to watch
                </p>
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label>Poll Interval (seconds)</Label>
            <Input
              type="number"
              min={10}
              max={3600}
              value={interval}
              onChange={(e) => setIntervalVal(Number(e.target.value))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch checked={active} onCheckedChange={setActive} />
              <span className="text-sm text-foreground">Active</span>
            </div>
            <Button className="w-40" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
              {mutation.isPending ? "Saving…" : existingRule ? "Update Rule" : "Create Rule"}
            </Button>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AutoPolling;

