import { apiClient } from "@/lib/api";
import type {
  AdminArticle,
  AdminArticleResponse,
  AdminArticlesResponse,
  Article,
  ArticleResponse,
  ArticlesResponse,
} from "@/types/article";
import type { Comment, SubmitCommentPayload } from "@/types/comment";

interface CommentsResponse {
  status: string;
  data: {
    comments: Comment[];
  };
}

interface SubmitCommentResponse {
  status: string;
  data: {
    comment: Comment;
  };
}

/**
 * L'API expose le blog sous /blog (et non /articles) — confirmé dans
 * blogs.html (`API_ENDPOINT = ${API_BASE_URL}/api/v1/blog`).
 * Les routes admin (CRUD) sont en revanche sous /admin/articles — cf.
 * admin-dashboard.html d'origine (`${BASE_URL}/admin/articles`).
 */
export const blogApi = {
  getAll: async (): Promise<Article[]> => {
    const { data } = await apiClient.get<ArticlesResponse>("/blog");
    return data.data.articles;
  },

  getBySlug: async (slug: string): Promise<Article> => {
    const { data } = await apiClient.get<ArticleResponse>(`/blog/${slug}`);
    return data.data.article;
  },

  getComments: async (slug: string): Promise<Comment[]> => {
    const { data } = await apiClient.get<CommentsResponse>(`/blog/${slug}/comments`);
    return data.data.comments;
  },

  submitComment: async (slug: string, payload: SubmitCommentPayload): Promise<Comment> => {
    const { data } = await apiClient.post<SubmitCommentResponse>(`/blog/${slug}/comments`, payload);
    return data.data.comment;
  },

  /** Admin uniquement — nécessite la session (cookie). */
  getAllAdmin: async (): Promise<AdminArticle[]> => {
    const { data } = await apiClient.get<AdminArticlesResponse>("/admin/articles", {
      withCredentials: true,
    });
    return data.data.articles;
  },

  /** Admin uniquement — nécessite la session (cookie). */
  getByIdAdmin: async (id: string): Promise<AdminArticle> => {
    const { data } = await apiClient.get<AdminArticleResponse>(`/admin/articles/${id}`, {
      withCredentials: true,
    });
    return data.data.article;
  },

  /** Admin uniquement — nécessite la session (cookie). */
  create: async (formData: FormData): Promise<AdminArticle> => {
    const { data } = await apiClient.post<AdminArticleResponse>("/admin/articles", formData, {
      withCredentials: true,
    });
    return data.data.article;
  },

  /** Admin uniquement — nécessite la session (cookie). */
  update: async (id: string, formData: FormData): Promise<AdminArticle> => {
    const { data } = await apiClient.patch<AdminArticleResponse>(`/admin/articles/${id}`, formData, {
      withCredentials: true,
    });
    return data.data.article;
  },

  /** Admin uniquement — nécessite la session (cookie). */
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/articles/${id}`, { withCredentials: true });
  },
};
