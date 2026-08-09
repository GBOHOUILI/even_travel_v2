import type { ArticleFormValues } from "@/features/blog/lib/articleFormSchema";
import type { AdminArticle } from "@/types/article";

/**
 * Construit le FormData multipart envoyé à POST/PATCH /admin/articles —
 * cf. saveBlog() dans admin-dashboard.html d'origine. Le backend attend
 * `published` (booléen), pas `statut` (champ interne au formulaire).
 */
export function buildArticleFormData(values: ArticleFormValues): FormData {
  const formData = new FormData();

  const imageFiles = values.images;
  if (imageFiles?.length) {
    Array.from(imageFiles).forEach((file) => formData.append("images", file));
  }

  formData.append("titre", values.titre);
  formData.append("contenu", values.contenu);
  formData.append("auteur", values.auteur);
  formData.append("categorie", values.categorie);
  formData.append("descriptionCourte", values.descriptionCourte);
  formData.append("published", String(values.statut === "published"));

  return formData;
}

/** Pré-remplissage du formulaire à partir d'un article existant (édition). */
export function articleToFormValues(article: AdminArticle): ArticleFormValues {
  return {
    titre: article.titre || "",
    categorie: article.categorie || "voyage",
    auteur: article.auteur || "",
    statut: article.published ? "published" : "draft",
    descriptionCourte: article.descriptionCourte || "",
    contenu: article.contenu || "",
    images: undefined,
  };
}
