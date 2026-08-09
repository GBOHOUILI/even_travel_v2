/**
 * Sur GET /admin/comments, le backend peuple `article` (titre visible dans
 * le tableau de modération — cf. `comment.article?.titre` dans
 * admin-dashboard.html d'origine). Sur les endpoints publics (soumission
 * d'un commentaire), `article` reste un simple id.
 */
export interface Comment {
  _id: string;
  article: string | { _id: string; titre?: string };
  nom: string;
  email?: string;
  message: string;
  approved: boolean;
  createdAt: string;
}

export interface SubmitCommentPayload {
  nom: string;
  email?: string;
  message: string;
}

/** Contrat de GET /admin/comments (admin, tous statuts confondus). */
export interface AdminCommentsResponse {
  status: string;
  data: {
    comments: Comment[];
    total?: number;
  };
}
