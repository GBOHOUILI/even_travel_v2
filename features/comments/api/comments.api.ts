import { apiClient } from "@/lib/api";
import type { AdminCommentsResponse, Comment } from "@/types/comment";

interface AdminCommentResponse {
  status: string;
  data: {
    comment: Comment;
  };
}

export const commentsApi = {
  /** Admin uniquement — nécessite la session (cookie). Tous statuts confondus. */
  getAll: async () => {
    const { data } = await apiClient.get<AdminCommentsResponse>("/admin/comments", {
      withCredentials: true,
    });
    return data.data.comments;
  },

  /** Admin uniquement — nécessite la session (cookie). */
  approve: async (id: string) => {
    const { data } = await apiClient.patch<AdminCommentResponse>(
      `/admin/comments/${id}/approve`,
      { approved: true },
      { withCredentials: true },
    );
    return data.data.comment;
  },

  /** Admin uniquement — nécessite la session (cookie). Sert aussi bien au
   * "Rejeter" (commentaire en attente) qu'au "Supprimer" (commentaire déjà
   * approuvé) — les deux actions suppriment le commentaire côté backend,
   * comme dans admin-dashboard.html d'origine (`deleteItem('comment', id)`). */
  remove: async (id: string) => {
    await apiClient.delete(`/admin/comments/${id}`, { withCredentials: true });
  },
};
