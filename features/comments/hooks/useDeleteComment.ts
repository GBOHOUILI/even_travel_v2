import { useMutation, useQueryClient } from "@tanstack/react-query";

import { commentsApi } from "@/features/comments/api/comments.api";
import { commentsKeys } from "@/features/comments/api/comments.keys";

/** Admin uniquement — nécessite la session (cookie). Utilisé pour "Rejeter"
 * (commentaire en attente) et "Supprimer" (commentaire approuvé). */
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => commentsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentsKeys.admin.all });
    },
  });
}
