import { useMutation } from "@tanstack/react-query";
import { createWebhookSubscription } from "@/lib/api/webhooks";

export function useCreateWebhookSubscription() {
  return useMutation({
    mutationFn: createWebhookSubscription,
  });
}
