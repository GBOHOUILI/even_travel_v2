import { useQuery } from "@tanstack/react-query";

import { analyticsApi } from "@/features/analytics/api/analytics.api";

export function useAnalyticsStats(days = 30) {
  return useQuery({
    queryKey: ["analytics", "stats", days],
    queryFn: () => analyticsApi.getStats(days),
  });
}
