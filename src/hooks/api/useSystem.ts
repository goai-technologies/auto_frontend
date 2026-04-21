import { useQuery } from "@tanstack/react-query";
import { getHealth, getReadiness, getSystemHealth } from "@/lib/api/system";
import { queryKeys } from "@/lib/queryKeys";

export function useHealth() {
  return useQuery({
    queryKey: queryKeys.system.health,
    queryFn: getHealth,
    retry: false,
  });
}

export function useReadiness() {
  return useQuery({
    queryKey: queryKeys.system.readiness,
    queryFn: getReadiness,
    retry: false,
  });
}

export function useSystemHealth() {
  return useQuery({
    queryKey: queryKeys.system.detail,
    queryFn: getSystemHealth,
    retry: false,
  });
}
