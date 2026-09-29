import { apiClient } from "@/lib/api";
import type { AnalyticsStats } from "@/features/analytics/api/analytics.types";

export const analyticsApi = {
  /** Admin uniquement — nécessite la session (cookie). */
  getStats: async (days = 30): Promise<AnalyticsStats> => {
    const { data } = await apiClient.get<{ data: AnalyticsStats }>("/analytics/stats", {
      params: { days },
      withCredentials: true,
    });
    return data.data;
  },
};
