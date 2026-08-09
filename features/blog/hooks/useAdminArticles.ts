import { useQuery } from "@tanstack/react-query";

import { blogApi } from "@/features/blog/api/blog.api";
import { blogKeys } from "@/features/blog/api/blog.keys";

/** Admin uniquement — nécessite la session (cookie). */
export function useAdminArticles() {
  return useQuery({
    queryKey: blogKeys.admin.list(),
    queryFn: blogApi.getAllAdmin,
  });
}
