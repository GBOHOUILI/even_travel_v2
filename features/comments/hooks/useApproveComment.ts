import { useMutation, useQueryClient } from "@tanstack/react-query";

import { commentsApi } from "@/features/comments/api/comments.api";
import { commentsKeys } from "@/features/comments/api/comments.keys";

/** Admin uniquement — nécessite la session (cookie). */
export function useApproveComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => commentsApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentsKeys.admin.all });
    },
  });
}
