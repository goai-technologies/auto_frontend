import { useQuery } from "@tanstack/react-query";
import { getRunArtifactDetail, listRunArtifacts, type RunArtifactsListParams } from "@/lib/api/runs";
import { queryKeys } from "@/lib/queryKeys";

export function useRunArtifacts(runId?: string, params: RunArtifactsListParams = {}) {
  return useQuery({
    queryKey: queryKeys.runs.artifacts(runId, params as Record<string, unknown>),
    queryFn: () => listRunArtifacts(runId!, params),
    enabled: !!runId,
  });
}

export function useArtifactDetail(runId?: string, artifactId?: string) {
  return useQuery({
    queryKey: queryKeys.runs.artifact(runId, artifactId),
    queryFn: () => getRunArtifactDetail(runId!, artifactId!),
    enabled: !!runId && !!artifactId,
  });
}
