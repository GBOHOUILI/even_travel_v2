export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: (days: number) => [...dashboardKeys.all, "stats", days] as const,
};
