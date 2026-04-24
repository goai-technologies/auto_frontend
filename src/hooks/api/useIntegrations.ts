import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  connectIntegration,
  listIntegrationProviders,
  listIntegrations,
  type ConnectIntegrationPayload,
  type IntegrationsListParams,
} from "@/lib/api/integrations";
import { queryKeys } from "@/lib/queryKeys";

export function useIntegrations(params: IntegrationsListParams = {}) {
  return useQuery({
    queryKey: queryKeys.integrations.list(params),
    queryFn: () => listIntegrations(params),
  });
}

export function useIntegrationProviders() {
  return useQuery({
    queryKey: queryKeys.integrations.providers,
    queryFn: listIntegrationProviders,
  });
}

export function useCreateIntegration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ConnectIntegrationPayload) => connectIntegration(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["integrations"] }),
  });
}
