"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { AdminModal } from "@/components/admin/shared/AdminModal";
import { useAdminArticle } from "@/features/blog/hooks/useAdminArticle";
import { useSaveArticle } from "@/features/blog/hooks/useSaveArticle";
import { articleToFormValues } from "@/features/blog/lib/articleFormMapper";
import {
  ARTICLE_FORM_DEFAULT_VALUES,
  articleFormSchema,
  type ArticleFormValues,
} from "@/features/blog/lib/articleFormSchema";
import { ApiError } from "@/lib/api";
import { useToast } from "@/providers/ToastProvider";
import { ADMIN_ARTICLE_CATEGORIES, ADMIN_ARTICLE_CATEGORY_LABELS } from "@/types/article";

interface ArticleFormModalProps {
  open: boolean;
  articleId: string | null;
  onClose: () => void;
}

export function ArticleFormModal({ open, articleId, onClose }: ArticleFormModalProps) {
  const { showToast } = useToast();
  const isEditing = !!articleId;
  const { data: existingArticle } = useAdminArticle(articleId ?? "", { enabled: open && isEditing });
  const saveArticle = useSaveArticle(articleId ?? undefined);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: ARTICLE_FORM_DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) return;
    if (isEditing && existingArticle) {
      reset(articleToFormValues(existingArticle));
    } else if (!isEditing) {
      reset(ARTICLE_FORM_DEFAULT_VALUES);
    }
  }, [open, isEditing, existingArticle, reset]);

  const onSubmit = handleSubmit((values) => {
    saveArticle.mutate(values, {
      onSuccess: () => {
        showToast(`Article ${isEditing ? "modifié" : "ajouté"} avec succès !`, "success");
        onClose();
      },
      onError: (error) => {
        const message =
          error instanceof ApiError ? error.message : "Erreur lors de l'enregistrement.";
        showToast(message, "error");
      },
    });
  });

  return (
    <AdminModal open={open} title={isEditing ? "Modifier l'Article" : "Ajouter un Article"} onClose={onClose}>
      <form onSubmit={onSubmit} noValidate>
        <div className="admin-form-section">
          <h3 className="admin-section-title-small">Informations Générales</h3>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label htmlFor="articleTitre">Titre *</label>
              <input id="articleTitre" type="text" aria-invalid={!!errors.titre} {...register("titre")} />
              {errors.titre && <p className="admin-field-error">{errors.titre.message}</p>}
            </div>
            <div className="admin-form-group">
              <label htmlFor="articleCategorie">Catégorie *</label>
              <select id="articleCategorie" {...register("categorie")}>
                {ADMIN_ARTICLE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {ADMIN_ARTICLE_CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label htmlFor="articleAuteur">Auteur *</label>
              <input
                id="articleAuteur"
                type="text"
                aria-invalid={!!errors.auteur}
                {...register("auteur")}
              />
              {errors.auteur && <p className="admin-field-error">{errors.auteur.message}</p>}
            </div>
            <div className="admin-form-group">
              <label htmlFor="articleStatut">Statut *</label>
              <select id="articleStatut" {...register("statut")}>
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
            </div>
          </div>
          <div className="admin-form-group">
            <label htmlFor="articleDescriptionCourte">Description courte *</label>
            <textarea
              id="articleDescriptionCourte"
              aria-invalid={!!errors.descriptionCourte}
              {...register("descriptionCourte")}
            />
            {errors.descriptionCourte && (
              <p className="admin-field-error">{errors.descriptionCourte.message}</p>
            )}
          </div>
          <div className="admin-form-group">
            <label htmlFor="articleContenu">Contenu *</label>
            <textarea
              id="articleContenu"
              rows={10}
              aria-invalid={!!errors.contenu}
              {...register("contenu")}
            />
            {errors.contenu && <p className="admin-field-error">{errors.contenu.message}</p>}
          </div>
        </div>

        <div className="admin-form-section">
          <h3 className="admin-section-title-small">Médias</h3>
          <div className="admin-form-group">
            <label htmlFor="articleImages">Image principale</label>
            <input id="articleImages" type="file" accept="image/*" {...register("images")} />
          </div>
        </div>

        <div className="admin-modal-actions">
          <button type="button" className="admin-cancel-modal-btn" onClick={onClose}>
            Annuler
          </button>
          <button type="submit" className="admin-save-btn" disabled={isSubmitting || saveArticle.isPending}>
            {saveArticle.isPending ? "Enregistrement..." : "Enregistrer l'Article"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
