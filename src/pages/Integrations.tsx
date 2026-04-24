import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateIntegration, useIntegrationProviders, useIntegrations } from "@/hooks/api/useIntegrations";
import { useCreateWebhookSubscription } from "@/hooks/api/useWebhooks";
import { IntegrationCard } from "@/components/integrations/IntegrationCard";
import { IntegrationFormDialog } from "@/components/integrations/IntegrationFormDialog";
import { WebhookSubscriptionDialog } from "@/components/integrations/WebhookSubscriptionDialog";
import { PageState } from "@/components/common/PageState";
import { EmptyState } from "@/components/common/EmptyState";
import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api/client";
import type { IntegrationItem } from "@/lib/api/types";

type Provider = "github" | "jira" | "linear" | string;
const DEFAULT_PROVIDERS: Provider[] = [
  "github",
  "jira",
  "linear",
  "bitbucket",
  "trello",
  "gitlab",
  "azure_devops",
  "asana",
  "clickup",
  "notion",
  "slack",
];

const Integrations = () => {
  const integrationsQuery = useIntegrations({ page: 1, page_size: 20 });
  const providersQuery = useIntegrationProviders();
  const connectMutation = useCreateIntegration();
  const webhookMutation = useCreateWebhookSubscription();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [webhookOpen, setWebhookOpen] = useState(false);
  const [integrationName, setIntegrationName] = useState("");
  const [secret, setSecret] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [email, setEmail] = useState("");

  const providerList = useMemo<Provider[]>(() => {
    const discovered = providersQuery.data?.providers ?? [];
    if (!discovered.length) return DEFAULT_PROVIDERS;
    return Array.from(new Set([...DEFAULT_PROVIDERS, ...discovered]));
  }, [providersQuery.data?.providers]);

  const integrations = integrationsQuery.data?.items ?? [];
  const ensured = useMemo<IntegrationItem[]>(() => {
    const map = new Map(
      integrations.map((i) => [String(i.provider).toLowerCase(), i] as const),
    );
    return providerList.map(
      (p) =>
        map.get(p) ?? {
          id: `virtual-${p}`,
          tenant_id: "",
          provider: p,
          health_status: "unknown",
        },
    );
  }, [integrations, providerList]);
  const currentIntegration = useMemo(
    () => ensured.find((item) => item.provider === provider),
    [ensured, provider],
  );

  const resetForm = () => {
    setIntegrationName("");
    setSecret("");
    setBaseUrl("");
    setEmail("");
  };

  const getValidationError = (currentProvider: Provider) => {
    const canReuseExistingSecret = currentIntegration?.has_credentials === true;
    if (currentProvider === "jira") {
      if (!baseUrl.trim()) return "Jira Base URL is required.";
      if (!email.trim()) return "Jira email/user is required.";
      if (!secret.trim() && !canReuseExistingSecret) return "Jira API token is required.";
    }
    if (currentProvider === "linear" && !secret.trim() && !canReuseExistingSecret) {
      return "Linear API key is required.";
    }
    if (currentProvider === "github" && !secret.trim() && !canReuseExistingSecret) {
      return "GitHub token or installation id is required.";
    }
    return null;
  };

  const handleSubmit = () => {
    if (!provider) return;
    const validationError = getValidationError(provider);
    if (validationError) {
      toast({ title: "Invalid integration payload", description: validationError });
      return;
    }

    const payloadBase = {
      provider,
      name: integrationName.trim() || `${provider}-default`,
      config: {} as Record<string, unknown>,
      secrets: {} as Record<string, unknown>,
    };

    if (provider === "github") {
      const normalizedSecret = secret.trim();
      if (normalizedSecret) {
        if (/^\d+$/.test(normalizedSecret)) payloadBase.secrets.installation_id = normalizedSecret;
        else payloadBase.secrets.token = normalizedSecret;
      }
      if (email.trim()) payloadBase.config.org = email.trim();
    } else if (provider === "jira") {
      payloadBase.config.base_url = baseUrl.trim();
      payloadBase.config.email_or_user = email.trim();
      if (secret.trim()) payloadBase.secrets.api_token = secret.trim();
    } else if (provider === "linear") {
      if (secret.trim()) payloadBase.secrets.api_key = secret.trim();
    } else {
      if (secret.trim()) payloadBase.secrets.token = secret.trim();
    }

    const payload = {
      provider: payloadBase.provider,
      name: payloadBase.name,
      ...(Object.keys(payloadBase.config).length ? { config: payloadBase.config } : {}),
      ...(Object.keys(payloadBase.secrets).length ? { secrets: payloadBase.secrets } : {}),
    };

    connectMutation
      .mutateAsync(payload)
      .then(() => {
        toast({ title: `${provider} integration saved` });
        setProvider(null);
        resetForm();
      })
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 403) {
          toast({ title: "Admin access required", description: "Only admins can connect integrations." });
          return;
        }
        if (err instanceof ApiError && err.status === 400) {
          toast({ title: "Invalid integration payload", description: err.message });
          return;
        }
        if (err instanceof ApiError && err.status === 410) {
          toast({ title: "Endpoint deprecated", description: "Backend rejected a deprecated integration route. Please refresh and retry." });
          return;
        }
        toast({
          title: `Failed to save ${provider}`,
          description: err instanceof Error ? err.message : "Unknown error",
        });
      });
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
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
        onOpenChange={(next) => {
          if (!next) {
            setProvider(null);
            resetForm();
          }
        }}
        title={provider ? `Configure ${provider}` : "Configure integration"}
        name={integrationName}
        secret={secret}
        onNameChange={setIntegrationName}
        onSecretChange={setSecret}
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
