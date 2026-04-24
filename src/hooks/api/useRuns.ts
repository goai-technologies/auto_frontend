import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getRun,
  getRunProgress,
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

export function useRunDetail(runId?: string, options?: { refetchIntervalMs?: number }) {
  return useQuery({
    queryKey: queryKeys.runs.detail(runId),
    queryFn: () => getRun(runId!),
    enabled: !!runId,
    refetchInterval: options?.refetchIntervalMs ?? false,
  });
}

export function useRunEvents(runId?: string, options?: { refetchIntervalMs?: number }) {
  return useQuery({
    queryKey: queryKeys.runs.events(runId),
    queryFn: () => listRunEvents(runId!),
    enabled: !!runId,
    refetchInterval: options?.refetchIntervalMs ?? false,
  });
}

export function useRunProgress(runId?: string) {
  return useQuery({
    queryKey: queryKeys.runs.progress(runId),
    queryFn: () => getRunProgress(runId!),
    enabled: !!runId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 2000;
      if (data.is_terminal) return 15000;
      return data.recommended_poll_interval_ms ?? 2000;
    },
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
      queryClient.invalidateQueries({ queryKey: queryKeys.runs.progress(runId) });
    },
  });
}
