import { apiRequest } from "./client";
import type { WebhookSubscription } from "./types";

export function createWebhookSubscription(body: {
  project_id: string;
  provider: string;
  event_types: string[];
  filters: Record<string, unknown>;
  auto_trigger: boolean;
  secret: string;
}) {
  return apiRequest<WebhookSubscription>("/webhooks/subscriptions", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
