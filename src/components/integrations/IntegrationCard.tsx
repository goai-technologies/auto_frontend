import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IntegrationHealthBadge } from "@/components/integrations/IntegrationHealthBadge";
import type { IntegrationItem } from "@/lib/api/types";

function inferCredentialsState(integration: IntegrationItem): {
  label: string;
  configured: boolean | "unknown";
} {
  if (integration.has_credentials === true) {
    return { label: integration.masked_credentials_hint ?? "Configured", configured: true };
  }
  if (integration.has_credentials === false) {
    return { label: "Missing", configured: false };
  }

  const hint = integration.masked_credentials_hint?.trim();
  if (hint && hint.toLowerCase() !== "not configured") {
    return { label: hint, configured: true };
  }

  if (integration.connected_at) {
    return { label: "Connected (credentials state not reported)", configured: "unknown" };
  }

  return { label: "Unknown", configured: "unknown" };
}

function getProviderLabel(provider: string) {
  return provider
    .split(/[_-]/g)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

export function IntegrationCard({
  integration,
  onConfigure,
}: {
  integration: IntegrationItem;
  onConfigure: () => void;
}) {
  const creds = inferCredentialsState(integration);
  const actionLabel =
    creds.configured === true ? "Reconfigure" : creds.configured === false ? "Connect" : "Configure";

  return (
    <Card className="bg-card/80 border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{getProviderLabel(String(integration.provider))}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Health</span>
          <IntegrationHealthBadge health={integration.health_status} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Credentials</span>
          <span>{creds.label}</span>
        </div>
        <Button className="w-full" variant="outline" onClick={onConfigure}>
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
