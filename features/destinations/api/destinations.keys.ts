export const destinationsKeys = {
  all: ["destinations"] as const,
  list: () => [...destinationsKeys.all, "list"] as const,
  detail: (id: string) => [...destinationsKeys.all, "detail", id] as const,
};
