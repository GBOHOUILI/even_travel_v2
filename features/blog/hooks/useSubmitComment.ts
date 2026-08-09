import { useMutation, useQueryClient } from "@tanstack/react-query";

import { blogApi } from "@/features/blog/api/blog.api";
import { blogKeys } from "@/features/blog/api/blog.keys";
import type { SubmitCommentPayload } from "@/types/comment";

export function useSubmitComment(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitCommentPayload) => blogApi.submitComment(slug, payload),
    onSuccess: () => {
      // Le nouveau commentaire est en attente de modération : on invalide
      // quand même le cache pour rester cohérent si le backend le renvoie
      // immédiatement (ex: environnement de test sans modération).
      queryClient.invalidateQueries({ queryKey: blogKeys.comments(slug) });
    },
  });
}
