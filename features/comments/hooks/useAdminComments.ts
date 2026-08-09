import { useQuery } from "@tanstack/react-query";

import { commentsApi } from "@/features/comments/api/comments.api";
import { commentsKeys } from "@/features/comments/api/comments.keys";

/** Admin uniquement — nécessite la session (cookie). Tous statuts confondus. */
export function useAdminComments() {
  return useQuery({
    queryKey: commentsKeys.admin.list(),
    queryFn: commentsApi.getAll,
  });
}
