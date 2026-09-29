import { useQuery } from "@tanstack/react-query";

import { dashboardApi } from "@/features/dashboard/api/dashboard.api";
import { dashboardKeys } from "@/features/dashboard/api/dashboard.keys";

export function useDashboardStats(days = 30) {
  return useQuery({
    queryKey: dashboardKeys.stats(days),
    queryFn: () => dashboardApi.getStats(days),
  });
}
