export const reservationsKeys = {
  all: ["reservations"] as const,
  list: () => [...reservationsKeys.all, "list"] as const,
  detail: (id: string) => [...reservationsKeys.all, "detail", id] as const,
  stats: () => [...reservationsKeys.all, "stats"] as const,
};
