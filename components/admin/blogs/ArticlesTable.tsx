"use client";

import { useMemo, useState } from "react";

import { ArticleFormModal } from "@/components/admin/blogs/ArticleFormModal";
import { ConfirmDeleteModal } from "@/components/admin/shared/ConfirmDeleteModal";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { useAdminArticles } from "@/features/blog/hooks/useAdminArticles";
import { useDeleteArticle } from "@/features/blog/hooks/useDeleteArticle";
import { ApiError } from "@/lib/api";
import { exportToCsv } from "@/lib/exportCsv";
import { useToast } from "@/providers/ToastProvider";
import { ADMIN_ARTICLE_CATEGORY_LABELS, type AdminArticleCategory } from "@/types/article";

const ITEMS_PER_PAGE = 10;

export function ArticlesTable() {
  const { data: articles, isLoading } = useAdminArticles();
  const deleteArticle = useDeleteArticle();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [page, setPage] = useState(1);
  const [formModal, setFormModal] = useState<{ open: boolean; articleId: string | null }>({
    open: false,
    articleId: null,
  });
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (articles ?? []).filter((a) => {
      const matchesSearch =
        !term ||
        a.titre.toLowerCase().includes(term) ||
        (a.auteur ?? "").toLowerCase().includes(term) ||
        (a.categorie ?? "").toLowerCase().includes(term);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && a.published) ||
        (statusFilter === "draft" && !a.published);
      return matchesSearch && matchesStatus;
    });
  }, [articles, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const confirmDelete = () => {
    if (!pendingDeleteId) return;
    deleteArticle.mutate(pendingDeleteId, {
      onSuccess: () => {
        showToast("Suppression effectuée avec succès !", "success");
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

  const handleExport = () => {
    const headers = ["Titre", "Auteur", "Date", "Catégorie", "Statut"];
    const rows = filtered.map((article) => [
      article.titre,
      article.auteur ?? "",
      new Date(article.datePublication || article.createdAt).toLocaleDateString("fr-FR"),
      article.categorie
        ? ADMIN_ARTICLE_CATEGORY_LABELS[article.categorie as AdminArticleCategory]
        : "",
      article.published ? "Publié" : "Brouillon",
    ]);
    exportToCsv("articles.csv", headers, rows);
  };

  return (
    <>
      <div className="admin-section-header">
        <h1 className="admin-section-title">Gestion des Articles</h1>
        <button
          type="button"
          className="admin-add-btn"
          onClick={() => setFormModal({ open: true, articleId: null })}
        >
          <i className="fas fa-plus" aria-hidden="true" /> Ajouter un Article
        </button>
      </div>

      <div className="admin-search-box">
        <input
          type="text"
          placeholder="Rechercher un article..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <button type="button" aria-label="Rechercher">
          <i className="fas fa-search" aria-hidden="true" />
        </button>
      </div>

      <div className="admin-data-table">
        <div className="admin-table-header">
          <h3 className="admin-table-title">Liste des Articles</h3>
          <div className="admin-table-header-actions">
            <div className="admin-filter-options">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as "all" | "published" | "draft");
                  setPage(1);
                }}
              >
                <option value="all">Tous les statuts</option>
                <option value="published">Publié</option>
                <option value="draft">Brouillon</option>
              </select>
            </div>
            <button type="button" className="admin-export-btn" onClick={handleExport}>
              <i className="fas fa-download" aria-hidden="true" /> Exporter CSV
            </button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Auteur</th>
              <th>Date</th>
              <th>Catégorie</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6}>Chargement des articles...</td>
              </tr>
            )}
            {!isLoading && paginated.length === 0 && (
              <tr>
                <td colSpan={6}>Aucun article disponible</td>
              </tr>
            )}
            {paginated.map((article) => (
              <tr key={article._id}>
                <td>{article.titre}</td>
                <td>{article.auteur}</td>
                <td>
                  {new Date(article.datePublication || article.createdAt).toLocaleDateString("fr-FR")}
                </td>
                <td>
                  {article.categorie
                    ? ADMIN_ARTICLE_CATEGORY_LABELS[article.categorie as AdminArticleCategory]
                    : "—"}
                </td>
                <td>
                  <StatusBadge active={article.published} activeLabel="Publié" inactiveLabel="Brouillon" />
                </td>
                <td>
                  <button
                    type="button"
                    className="admin-action-btn admin-edit-btn"
                    onClick={() => setFormModal({ open: true, articleId: article._id })}
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    className="admin-action-btn admin-delete-btn"
                    onClick={() => setPendingDeleteId(article._id)}
                  >
                    Supprimer
                  </button>
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

      <ArticleFormModal
        open={formModal.open}
        articleId={formModal.articleId}
        onClose={() => setFormModal({ open: false, articleId: null })}
      />

      <ConfirmDeleteModal
        open={!!pendingDeleteId}
        message="Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible."
        isPending={deleteArticle.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </>
  );
}
