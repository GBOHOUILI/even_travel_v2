import { useQuery } from "@tanstack/react-query";

import { blogApi } from "@/features/blog/api/blog.api";
import { blogKeys } from "@/features/blog/api/blog.keys";

export function useArticle(slug: string) {
  return useQuery({
    queryKey: blogKeys.detail(slug),
    queryFn: () => blogApi.getBySlug(slug),
    enabled: Boolean(slug),
  });
}
