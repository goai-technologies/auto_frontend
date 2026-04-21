import { useQuery } from "@tanstack/react-query";
import { getOnboardingStatus } from "@/lib/api/onboarding";
import { queryKeys } from "@/lib/queryKeys";

export function useOnboardingStatus() {
  return useQuery({
    queryKey: queryKeys.onboarding.status,
    queryFn: getOnboardingStatus,
  });
}
