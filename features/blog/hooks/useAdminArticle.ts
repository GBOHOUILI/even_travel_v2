import { useQuery } from "@tanstack/react-query";

import { blogApi } from "@/features/blog/api/blog.api";
import { blogKeys } from "@/features/blog/api/blog.keys";

/** Admin uniquement — nécessite la session (cookie). */
export function useAdminArticle(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: blogKeys.admin.detail(id),
    queryFn: () => blogApi.getByIdAdmin(id),
    enabled: Boolean(id) && (options?.enabled ?? true),
  });
}
