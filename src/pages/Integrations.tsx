import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getProviderLabel } from "@/lib/format";
import { CheckCircle, XCircle, Github, Ticket, Waypoints, ChevronRight, Settings } from "lucide-react";
import { listIntegrations, connectGithub, connectJira, connectLinear, IntegrationRow } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

type Provider = "github" | "jira" | "linear";
type ComingSoonProvider =
  | "bitbucket"
  | "gitlab"
  | "azure_devops"
  | "clickup"
  | "asana"
  | "trello"
  | "slack"
  | "teams"
  | "discord";

function ProviderIcon({ provider }: { provider: Provider }) {
  const cls = "h-5 w-5";
  switch (provider) {
    case "github":
      return <Github className={cls} />;
    case "jira":
      return <Ticket className={cls} />;
    case "linear":
      return <Waypoints className={cls} />;
  }
}

function ConnectGitHubForm({ onClose }: { onClose: () => void }) {
  const [installationId, setInstallationId] = useState("");
  const [org, setOrg] = useState("");
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => connectGithub({ installation_id: installationId, org }),
    onSuccess: () => {
      toast({ title: "GitHub connected" });
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      onClose();
    },
    onError: (err: any) => {
      toast({ title: "GitHub connection failed", description: err?.message });
    },
  });
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Installation / Token ID</Label>
        <Textarea
          placeholder="12345 or ghp_xxxxxxxxxxxx"
          value={installationId}
          onChange={(e) => setInstallationId(e.target.value)}
          className="font-mono text-xs"
        />
        <p className="text-xs text-muted-foreground">
          Use your GitHub App installation ID or a PAT with <code className="text-primary">repo</code> scope.
        </p>
      </div>
      <div className="space-y-2">
        <Label>Organization</Label>
        <Input placeholder="abc-corp" value={org} onChange={(e) => setOrg(e.target.value)} />
      </div>
      <Button className="w-full" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        {mutation.isPending ? "Connecting…" : "Connect GitHub"}
      </Button>
    </div>
  );
}

function ConnectJiraForm({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [baseUrl, setBaseUrl] = useState("");
  const [email, setEmail] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [projectKeys, setProjectKeys] = useState("PAY");
  const mutation = useMutation({
    mutationFn: () =>
      connectJira({
        base_url: baseUrl,
        email_or_user: email,
        api_token: apiToken,
        project_keys: projectKeys.split(",").map((k) => k.trim()),
      }),
    onSuccess: () => {
      toast({ title: "Jira connected" });
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      onClose();
    },
    onError: (err: any) => {
      toast({ title: "Jira connection failed", description: err?.message });
    },
  });
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Base URL</Label>
        <Input
          placeholder="https://your-org.atlassian.net"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input placeholder="you@company.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>API Token</Label>
        <Input
          placeholder="Jira API token"
          type="password"
          value={apiToken}
          onChange={(e) => setApiToken(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Project keys</Label>
        <Input placeholder="PAY, USR" value={projectKeys} onChange={(e) => setProjectKeys(e.target.value)} />
      </div>
      <Button className="w-full" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        {mutation.isPending ? "Connecting…" : "Connect Jira"}
      </Button>
    </div>
  );
}

function ConnectLinearForm({ onClose }: { onClose: () => void }) {
  const [apiKey, setApiKey] = useState("");
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => connectLinear({ api_key: apiKey }),
    onSuccess: () => {
      toast({ title: "Linear connected" });
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      onClose();
    },
    onError: (err: any) => {
      toast({ title: "Linear connection failed", description: err?.message });
    },
  });
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>API Key</Label>
        <Input
          placeholder="lin_api_xxxxxxxxxxxx"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </div>
      <Button className="w-full" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        {mutation.isPending ? "Connecting…" : "Connect Linear"}
      </Button>
    </div>
  );
}

const SENSITIVE_KEYS = new Set(["installation_id", "api_token", "api_key", "token", "secret"]);

function parseMetadata(metadataJson: string | undefined): Record<string, unknown> {
  if (!metadataJson?.trim()) return {};
  try {
    const parsed = JSON.parse(metadataJson);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function MetadataKeyValues({ metadataJson }: { metadataJson: string | undefined }) {
  const params = parseMetadata(metadataJson);
  const entries = Object.entries(params);
  if (entries.length === 0) return <p className="text-sm text-muted-foreground">No parameters stored.</p>;
  return (
    <dl className="space-y-2">
      {entries.map(([key, value]) => {
        const label = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        const isSensitive = SENSITIVE_KEYS.has(key.toLowerCase());
        const display =
          value === null || value === undefined
            ? "—"
            : Array.isArray(value)
              ? value.join(", ")
              : String(value);
        return (
          <div key={key} className="flex justify-between gap-4 border-b border-border/60 pb-2 last:border-0">
            <dt className="text-sm text-muted-foreground shrink-0">{label}</dt>
            <dd className="text-sm text-foreground text-right break-all">
              {isSensitive && display ? "••••••" : display}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

function IntegrationDetailsSheet({
  integration,
  open,
  onOpenChange,
  onReconfigure,
}: {
  integration: IntegrationRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReconfigure: () => void;
}) {
  const isConnected = integration.status === "connected";
  const isError = integration.status === "error";
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ProviderIcon provider={integration.provider} />
            {getProviderLabel(integration.provider)} – Details
          </SheetTitle>
          <SheetDescription>
            {isConnected ? "Connection parameters and status." : "This integration is not connected."}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Status</h4>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm text-success">Connected</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Not connected</span>
                </>
              )}
            </div>
          </div>
          {isConnected && integration.connected_at && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Connected at</h4>
              <p className="text-sm text-muted-foreground">{integration.connected_at}</p>
            </div>
          )}
          {integration.last_error && (
            <div>
              <h4 className="text-sm font-medium text-destructive mb-2">Last error</h4>
              <p className="text-sm text-muted-foreground break-words">{integration.last_error}</p>
            </div>
          )}
          {isConnected && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Parameters</h4>
              <div className="rounded-md bg-muted/50 p-3">
                <MetadataKeyValues metadataJson={integration.metadata_json} />
              </div>
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={onReconfigure}>
              <Settings className="h-4 w-4 mr-2" />
              {isConnected ? "Reconfigure" : "Connect"}
            </Button>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

const IntegrationCard = ({ integration }: { integration: IntegrationRow }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const FormComponent = {
    github: ConnectGitHubForm,
    jira: ConnectJiraForm,
    linear: ConnectLinearForm,
  }[integration.provider];
  const isConnected = integration.status === "connected";
  const isError = integration.status === "error";

  return (
    <>
      <Card className="bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  isConnected ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                }`}
              >
                <ProviderIcon provider={integration.provider} />
              </div>
              <div>
                <CardTitle className="text-base">{getProviderLabel(integration.provider)}</CardTitle>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {isConnected ? (
                    <>
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                      </span>
                      <span className="text-xs text-success">Working</span>
                    </>
                  ) : isError ? (
                    <>
                      <span className="inline-flex h-2 w-2 rounded-full bg-destructive" />
                      <span className="text-xs text-destructive">Error</span>
                    </>
                  ) : (
                    <>
                      <span className="inline-flex h-2 w-2 rounded-full bg-muted-foreground/70" />
                      <span className="text-xs text-muted-foreground">Not connected</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {isConnected ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between"
                onClick={() => setSheetOpen(true)}
              >
                View details
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    Reconfigure
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Connect {getProviderLabel(integration.provider)}</DialogTitle>
                  </DialogHeader>
                  <FormComponent onClose={() => setDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default" size="sm" className="w-full">
                  Connect
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Connect {getProviderLabel(integration.provider)}</DialogTitle>
                </DialogHeader>
                <FormComponent onClose={() => setDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>
      <IntegrationDetailsSheet
        integration={integration}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onReconfigure={() => {
          setSheetOpen(false);
          setDialogOpen(true);
        }}
      />
    </>
  );
};

function MockIntegrationCard({ name, category }: { name: string; category: "Dev" | "PM" | "Comms" }) {
  const [connected, setConnected] = useState(false);

  const handleConnect = () => {
    setConnected(true);
    toast({ title: `${name} connected`, description: "Mock integration configured." });
  };

  return (
    <Card className="bg-card border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-lg flex items-center justify-center text-xs font-semibold ${
                connected ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
              }`}
            >
              {name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <CardTitle className="text-base">{name}</CardTitle>
              <div className="flex items-center gap-1.5 mt-0.5">
                {connected ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                    </span>
                    <span className="text-xs text-success">Working</span>
                  </>
                ) : (
                  <>
                    <span className="inline-flex h-2 w-2 rounded-full bg-muted-foreground/70" />
                    <span className="text-xs text-muted-foreground">Not connected</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
            {category}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <Button variant={connected ? "outline" : "default"} size="sm" className="w-full" onClick={handleConnect}>
          {connected ? "Reconfigure" : "Connect"}
        </Button>
      </CardContent>
    </Card>
  );
}

const Integrations = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["integrations"],
    queryFn: listIntegrations,
  });

  if (isLoading || !data) {
    return <div className="text-sm text-muted-foreground">Loading integrations…</div>;
  }

  const providers: Provider[] = ["github", "jira", "linear"];

  const cards: IntegrationRow[] = providers.map((provider) => {
    const existing = data.find((i) => i.provider === provider);
    if (existing) return existing;
    return {
      id: `virtual-${provider}`,
      tenant_id: "",
      provider,
      status: "disconnected",
      connected_at: "",
      last_error: "",
      metadata_json: "",
    };
  });

  const comingSoon: { key: ComingSoonProvider; name: string; category: "Dev" | "PM" | "Comms" }[] = [
    { key: "bitbucket", name: "Bitbucket", category: "Dev" },
    { key: "gitlab", name: "GitLab", category: "Dev" },
    { key: "azure_devops", name: "Azure DevOps", category: "Dev" },
    { key: "clickup", name: "ClickUp", category: "PM" },
    { key: "asana", name: "Asana", category: "PM" },
    { key: "trello", name: "Trello", category: "PM" },
    { key: "slack", name: "Slack", category: "Comms" },
    { key: "teams", name: "Microsoft Teams", category: "Comms" },
    { key: "discord", name: "Discord", category: "Comms" },
  ];

  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Integrations</h1>
        <p className="mt-1 text-sm text-muted-foreground">Connect your tools to enable ticket → PR workflows</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {cards.map((int) => (
          <IntegrationCard key={int.id} integration={int} />
        ))}
      </div>

      <div className="pt-2">
        <h2 className="text-lg font-semibold text-foreground">More integrations</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Commonly used platforms across code hosting, project management, and communication.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {comingSoon.map((item) => (
          <MockIntegrationCard key={item.key} name={item.name} category={item.category} />
        ))}
      </div>
    </div>
  );
};

export default Integrations;

