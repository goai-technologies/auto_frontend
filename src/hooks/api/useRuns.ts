import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getRun,
  listRunEvents,
  listRuns,
  rerunRun,
  rerunStep,
  startRun,
  type RunsListParams,
} from "@/lib/api/runs";
import { queryKeys } from "@/lib/queryKeys";

export function useRuns(params: RunsListParams) {
  return useQuery({
    queryKey: queryKeys.runs.list(params),
    queryFn: () => listRuns(params),
  });
}

export function useRunDetail(runId?: string) {
  return useQuery({
    queryKey: queryKeys.runs.detail(runId),
    queryFn: () => getRun(runId!),
    enabled: !!runId,
  });
}

export function useRunEvents(runId?: string) {
  return useQuery({
    queryKey: queryKeys.runs.events(runId),
    queryFn: () => listRunEvents(runId!),
    enabled: !!runId,
  });
}

export function useTriggerRun(projectId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof startRun>[1]) => startRun(projectId!, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["runs"] });
    },
  });
}

export function useRerunRun(runId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => rerunRun(runId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["runs"] });
    },
  });
}

export function useRerunStep(runId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ stepId }: { stepId: string }) => rerunStep(runId!, stepId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.runs.detail(runId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.runs.events(runId) });
    },
  });
}
