"use client";

import { useMemo, useState } from "react";

import { ConfirmDeleteModal } from "@/components/admin/shared/ConfirmDeleteModal";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { useAdminComments } from "@/features/comments/hooks/useAdminComments";
import { useApproveComment } from "@/features/comments/hooks/useApproveComment";
import { useDeleteComment } from "@/features/comments/hooks/useDeleteComment";
import { ApiError } from "@/lib/api";
import { useToast } from "@/providers/ToastProvider";

const ITEMS_PER_PAGE = 10;
const MESSAGE_PREVIEW_LENGTH = 50;

type CommentFilter = "all" | "pending" | "approved";

/** Titre de l'article lié — populé par le backend sur GET /admin/comments,
 * potentiellement absent (cf. types/comment.ts). */
function getArticleTitle(article: string | { _id: string; titre?: string }) {
  if (typeof article === "string") return "Non spécifié";
  return article.titre || "Non spécifié";
}

export function CommentsTable() {
  const { data: comments, isLoading } = useAdminComments();
  const approveComment = useApproveComment();
  const deleteComment = useDeleteComment();
  const { showToast } = useToast();

  const [filter, setFilter] = useState<CommentFilter>("all");
  const [page, setPage] = useState(1);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return (comments ?? []).filter((c) => {
      if (filter === "pending") return !c.approved;
      if (filter === "approved") return c.approved;
      return true;
    });
  }, [comments, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleApprove = (id: string) => {
    approveComment.mutate(id, {
      onSuccess: () => showToast("Commentaire approuvé avec succès !", "success"),
      onError: (error) => {
        const message =
          error instanceof ApiError ? error.message : "Erreur lors de l'approbation.";
        showToast(message, "error");
      },
    });
  };

  const confirmDelete = () => {
    if (!pendingDeleteId) return;
    deleteComment.mutate(pendingDeleteId, {
      onSuccess: () => {
        showToast("Commentaire supprimé avec succès !", "success");
        setPendingDeleteId(null);
      },
      onError: (error) => {
        const message =
          error instanceof ApiError ? error.message : "Erreur lors de la suppression.";
        showToast(message, "error");
        setPendingDeleteId(null);
      },
    });
  };

  return (
    <>
      <div className="admin-section-header">
        <h1 className="admin-section-title">Gestion des Commentaires</h1>
      </div>

      <div className="admin-data-table">
        <div className="admin-table-header">
          <h3 className="admin-table-title">Commentaires récents</h3>
          <div className="admin-filter-options">
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value as CommentFilter);
                setPage(1);
              }}
            >
              <option value="all">Tous les commentaires</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvés</option>
            </select>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Article</th>
              <th>Commentaire</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6}>Chargement des commentaires...</td>
              </tr>
            )}
            {!isLoading && paginated.length === 0 && (
              <tr>
                <td colSpan={6}>Aucun commentaire disponible</td>
              </tr>
            )}
            {paginated.map((comment) => (
              <tr key={comment._id}>
                <td>{comment.nom || "Anonyme"}</td>
                <td>{getArticleTitle(comment.article)}</td>
                <td>
                  {comment.message.length > MESSAGE_PREVIEW_LENGTH
                    ? `${comment.message.slice(0, MESSAGE_PREVIEW_LENGTH)}...`
                    : comment.message}
                </td>
                <td>{new Date(comment.createdAt).toLocaleDateString("fr-FR")}</td>
                <td>
                  <StatusBadge active={comment.approved} activeLabel="Approuvé" inactiveLabel="En attente" />
                </td>
                <td>
                  {!comment.approved ? (
                    <>
                      <button
                        type="button"
                        className="admin-action-btn admin-edit-btn"
                        onClick={() => handleApprove(comment._id)}
                        disabled={approveComment.isPending}
                      >
                        Approuver
                      </button>
                      <button
                        type="button"
                        className="admin-action-btn admin-delete-btn"
                        onClick={() => setPendingDeleteId(comment._id)}
                      >
                        Rejeter
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="admin-action-btn admin-delete-btn"
                      onClick={() => setPendingDeleteId(comment._id)}
                    >
                      Supprimer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="admin-pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                className={`admin-page-btn ${p === currentPage ? "active" : ""}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        open={!!pendingDeleteId}
        message="Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible."
        isPending={deleteComment.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </>
  );
}
