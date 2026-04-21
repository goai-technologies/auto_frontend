import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProject, getProject, listProjects, type ProjectsListParams } from "@/lib/api/projects";
import { queryKeys } from "@/lib/queryKeys";

export function useProjects(params: ProjectsListParams = {}) {
  return useQuery({
    queryKey: queryKeys.projects.list(params),
    queryFn: () => listProjects(params),
  });
}

export function useProject(projectId?: string) {
  return useQuery({
    queryKey: queryKeys.projects.detail(projectId),
    queryFn: () => getProject(projectId!),
    enabled: !!projectId,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
