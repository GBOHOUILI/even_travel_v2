export const commentsKeys = {
  admin: {
    all: ["admin-comments"] as const,
    list: () => [...commentsKeys.admin.all, "list"] as const,
  },
};
