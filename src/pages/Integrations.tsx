import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { mockIntegrations, Integration } from "@/lib/mock-data";
import { getProviderLabel } from "@/lib/format";
import { CheckCircle, XCircle, Github, Ticket, Waypoints } from "lucide-react";
import { toast } from "sonner";

function ProviderIcon({ provider }: { provider: Integration["provider"] }) {
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
  const [token, setToken] = useState("");
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Personal Access Token</Label>
        <Textarea
          placeholder="ghp_xxxxxxxxxxxx"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="font-mono text-xs"
        />
        <p className="text-xs text-muted-foreground">
          Generate a PAT with <code className="text-primary">repo</code> scope from GitHub Settings → Developer
          Settings → Personal Access Tokens.
        </p>
      </div>
      <Button
        className="w-full"
        onClick={() => {
          toast.success("GitHub connected");
          onClose();
        }}
      >
        Connect GitHub
      </Button>
    </div>
  );
}

function ConnectJiraForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Base URL</Label>
        <Input placeholder="https://your-org.atlassian.net" />
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input placeholder="you@company.com" type="email" />
      </div>
      <div className="space-y-2">
        <Label>API Token</Label>
        <Input placeholder="Jira API token" type="password" />
      </div>
      <Button
        className="w-full"
        onClick={() => {
          toast.success("Jira connected");
          onClose();
        }}
      >
        Connect Jira
      </Button>
    </div>
  );
}

function ConnectLinearForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>API Key</Label>
        <Input placeholder="lin_api_xxxxxxxxxxxx" type="password" />
      </div>
      <div className="space-y-2">
        <Label>Default Team Key (optional)</Label>
        <Input placeholder="ENG" />
      </div>
      <Button
        className="w-full"
        onClick={() => {
          toast.success("Linear connected");
          onClose();
        }}
      >
        Connect Linear
      </Button>
    </div>
  );
}

const IntegrationCard = ({ integration }: { integration: Integration }) => {
  const [open, setOpen] = useState(false);
  const FormComponent = {
    github: ConnectGitHubForm,
    jira: ConnectJiraForm,
    linear: ConnectLinearForm,
  }[integration.provider];

  return (
    <Card className="bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                integration.connected ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
              }`}
            >
              <ProviderIcon provider={integration.provider} />
            </div>
            <div>
              <CardTitle className="text-base">{getProviderLabel(integration.provider)}</CardTitle>
              <div className="flex items-center gap-1.5 mt-0.5">
                {integration.connected ? (
                  <>
                    <CheckCircle className="h-3 w-3 text-success" />
                    <span className="text-xs text-success">Connected</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Not connected</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {integration.connected && integration.details && (
          <div className="mb-3 rounded-md bg-muted p-2.5">
            {Object.entries(integration.details).map(([k, v]) => (
              <p key={k} className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{k}:</span> {v}
              </p>
            ))}
          </div>
        )}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant={integration.connected ? "outline" : "default"} className="w-full" size="sm">
              {integration.connected ? "Reconfigure" : "Connect"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect {getProviderLabel(integration.provider)}</DialogTitle>
            </DialogHeader>
            <FormComponent onClose={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

const Integrations = () => {
  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Integrations</h1>
        <p className="mt-1 text-sm text-muted-foreground">Connect your tools to enable ticket → PR workflows</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {mockIntegrations.map((int) => (
          <IntegrationCard key={int.provider} integration={int} />
        ))}
      </div>
    </div>
  );
};

export default Integrations;

