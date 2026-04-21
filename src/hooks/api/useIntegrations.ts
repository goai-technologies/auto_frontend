import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { connectGithub, connectJira, connectLinear, listIntegrations, type IntegrationsListParams } from "@/lib/api/integrations";
import { queryKeys } from "@/lib/queryKeys";

export function useIntegrations(params: IntegrationsListParams = {}) {
  return useQuery({
    queryKey: queryKeys.integrations.list(params),
    queryFn: () => listIntegrations(params),
  });
}

export function useCreateIntegration() {
  const queryClient = useQueryClient();
  return {
    github: useMutation({
      mutationFn: connectGithub,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["integrations"] }),
    }),
    jira: useMutation({
      mutationFn: connectJira,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["integrations"] }),
    }),
    linear: useMutation({
      mutationFn: connectLinear,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["integrations"] }),
    }),
  };
}
