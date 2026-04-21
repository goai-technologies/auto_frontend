import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, getUser, listUsers, updateUser, type UsersListParams } from "@/lib/api/users";
import { queryKeys } from "@/lib/queryKeys";

export function useUsers(params: UsersListParams = {}) {
  return useQuery({
    queryKey: queryKeys.users.list(params as Record<string, unknown>),
    queryFn: () => listUsers(params),
  });
}

export function useUser(userId?: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(userId),
    queryFn: () => getUser(userId!),
    enabled: !!userId,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useUpdateUser(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof updateUser>[1]) => updateUser(userId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}
