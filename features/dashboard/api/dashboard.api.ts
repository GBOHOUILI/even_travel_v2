import { apiClient } from "@/lib/api";
import type { DashboardResponse, DashboardStats } from "@/features/dashboard/api/dashboard.types";

export const dashboardApi = {
  /** Admin uniquement, nécessite la session (cookie). */
  getStats: async (days: number): Promise<DashboardStats> => {
    const { data } = await apiClient.get<DashboardResponse>("/admin/dashboard", {
      params: { days },
      withCredentials: true,
    });
    return data.data;
  },
};
