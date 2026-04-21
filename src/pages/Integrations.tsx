import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateIntegration, useIntegrations } from "@/hooks/api/useIntegrations";
import { useCreateWebhookSubscription } from "@/hooks/api/useWebhooks";
import { IntegrationCard } from "@/components/integrations/IntegrationCard";
import { IntegrationFormDialog } from "@/components/integrations/IntegrationFormDialog";
import { WebhookSubscriptionDialog } from "@/components/integrations/WebhookSubscriptionDialog";
import { PageState } from "@/components/common/PageState";
import { EmptyState } from "@/components/common/EmptyState";
import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api/client";
import type { IntegrationItem } from "@/lib/api/types";

type Provider = "github" | "jira" | "linear";

const Integrations = () => {
  const integrationsQuery = useIntegrations({ page: 1, page_size: 20 });
  const { github, jira, linear } = useCreateIntegration();
  const webhookMutation = useCreateWebhookSubscription();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [webhookOpen, setWebhookOpen] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");
  const [email, setEmail] = useState("");

  const integrations = integrationsQuery.data?.items ?? [];
  const ensured = useMemo<IntegrationItem[]>(() => {
    const map = new Map(
      integrations.map((i) => [String(i.provider).toLowerCase(), i] as const),
    );
    return (["github", "jira", "linear"] as Provider[]).map(
      (p) =>
        map.get(p) ?? {
          id: `virtual-${p}`,
          tenant_id: "",
          provider: p,
          health_status: "unknown",
        },
    );
  }, [integrations]);

  const handleSubmit = (rawSecret: string) => {
    if (!provider) return;
    if (provider === "github") {
      github
        .mutateAsync({ installation_id: rawSecret, org: email || "default-org" })
        .then(() => toast({ title: "GitHub integration saved" }))
        .catch((err: any) => toast({ title: "Failed to save GitHub", description: err?.message }));
    }
    if (provider === "jira") {
      jira
        .mutateAsync({ base_url: baseUrl, email_or_user: email, api_token: rawSecret })
        .then(() => toast({ title: "Jira integration saved" }))
        .catch((err: any) => toast({ title: "Failed to save Jira", description: err?.message }));
    }
    if (provider === "linear") {
      linear
        .mutateAsync({ api_key: rawSecret })
        .then(() => toast({ title: "Linear integration saved" }))
        .catch((err: any) => toast({ title: "Failed to save Linear", description: err?.message }));
    }
    setProvider(null);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Integrations</h1>
        <p className="mt-1 text-sm text-muted-foreground">Connect providers with masked and secure credential handling.</p>
      </div>

      <PageState
        loading={integrationsQuery.isLoading}
        error={integrationsQuery.isError ? "Failed to load integrations." : null}
        onRetry={() => integrationsQuery.refetch()}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {ensured.map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} onConfigure={() => setProvider(integration.provider)} />
            ))}
          </div>
          {!ensured.length && <EmptyState message="No integrations found." />}
        </div>
      </PageState>

      <Card className="bg-card/80 border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Credential update rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Credentials are never displayed in plain text.</p>
          <p>If you leave credential input blank, existing encrypted credentials remain unchanged.</p>
        </CardContent>
      </Card>

      <Button variant="outline" onClick={() => setWebhookOpen(true)}>
        Add webhook subscription
      </Button>

      <IntegrationFormDialog
        open={!!provider}
        onOpenChange={(next) => !next && setProvider(null)}
        title={provider ? `Configure ${provider}` : "Configure integration"}
        onSubmit={handleSubmit}
      />
      {provider === "jira" && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <Label>Jira Base URL</Label>
            <Input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://jira.example.com" />
          </div>
          <div className="space-y-1">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" />
          </div>
        </div>
      )}
      {provider === "github" && (
        <div className="space-y-1">
          <Label>GitHub org (optional)</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="acme" />
        </div>
      )}
      <WebhookSubscriptionDialog
        open={webhookOpen}
        onOpenChange={setWebhookOpen}
        onSubmit={(payload) =>
          webhookMutation
            .mutateAsync(payload)
            .then(() => {
              toast({ title: "Webhook subscription saved" });
              setWebhookOpen(false);
            })
            .catch((err: unknown) => {
              if (err instanceof ApiError && err.status === 400) {
                toast({ title: "Invalid webhook payload", description: err.message });
                return;
              }
              toast({ title: "Webhook subscription failed", description: err instanceof Error ? err.message : "Unknown error" });
            })
        }
      />
    </div>
  );
};

export default Integrations;
