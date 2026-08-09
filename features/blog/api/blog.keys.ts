export const blogKeys = {
  all: ["articles"] as const,
  list: () => [...blogKeys.all, "list"] as const,
  detail: (slug: string) => [...blogKeys.all, "detail", slug] as const,
  comments: (slug: string) => [...blogKeys.all, "comments", slug] as const,
  admin: {
    all: ["admin-articles"] as const,
    list: () => [...blogKeys.admin.all, "list"] as const,
    detail: (id: string) => [...blogKeys.admin.all, "detail", id] as const,
  },
};
