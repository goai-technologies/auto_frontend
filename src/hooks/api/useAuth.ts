import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, login, register } from "@/lib/api/auth";
import { setAuthToken } from "@/lib/api/client";
import { queryKeys } from "@/lib/queryKeys";

export function useCurrentUser(enabled = true) {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: getMe,
    enabled,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return () => {
    setAuthToken(null);
    queryClient.removeQueries();
  };
}
