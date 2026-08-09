import { useMutation, useQueryClient } from "@tanstack/react-query";

import { blogApi } from "@/features/blog/api/blog.api";
import { blogKeys } from "@/features/blog/api/blog.keys";

/** Admin uniquement — nécessite la session (cookie). */
export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blogApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.admin.all });
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
  });
}
