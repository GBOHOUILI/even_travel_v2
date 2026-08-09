import { useQuery } from "@tanstack/react-query";

import { blogApi } from "@/features/blog/api/blog.api";
import { blogKeys } from "@/features/blog/api/blog.keys";

export function useArticleComments(slug: string) {
  return useQuery({
    queryKey: blogKeys.comments(slug),
    queryFn: () => blogApi.getComments(slug),
    enabled: Boolean(slug),
  });
}
