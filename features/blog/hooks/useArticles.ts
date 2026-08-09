import { useQuery } from "@tanstack/react-query";

import { blogApi } from "@/features/blog/api/blog.api";
import { blogKeys } from "@/features/blog/api/blog.keys";

export function useArticles() {
  return useQuery({
    queryKey: blogKeys.list(),
    queryFn: blogApi.getAll,
  });
}
