import type { Article, ArticleCategory } from "@/types/article";

const DEFAULT_CATEGORY: ArticleCategory = "culture";

const DEFAULT_IMAGES_BY_CATEGORY: Record<ArticleCategory, string> = {
  festival: "/images/musi.jpg",
  exposition: "/images/art.jpg",
  conference: "/images/conf.jpg",
  voyage: "/images/travel.jpg",
  culture: "/images/culture.jpg",
};

export const ARTICLE_CATEGORY_LABELS: Record<ArticleCategory, string> = {
  festival: "Festival",
  exposition: "Exposition",
  conference: "Conférence",
  voyage: "Voyage",
  culture: "Culture",
};

const DEFAULT_ARTICLE_IMAGE = "/images/blog-default.jpg";

/**
 * L'API ne renvoie pas de champ "catégorie" — elle est déduite du
 * titre/contenu, exactement comme dans blogs.html (getArticleCategory).
 */
export function getArticleCategory(article: Pick<Article, "titre" | "contenu">): ArticleCategory {
  const title = (article.titre || "").toLowerCase();
  const content = (article.contenu || "").toLowerCase();
  const haystack = `${title} ${content}`;

  if (haystack.includes("festival")) return "festival";
  if (haystack.includes("exposition")) return "exposition";
  if (haystack.includes("conférence") || haystack.includes("conference")) return "conference";
  if (haystack.includes("voyage")) return "voyage";
  if (haystack.includes("culture")) return "culture";

  return DEFAULT_CATEGORY;
}

/**
 * Reprend l'optimisation Cloudinary de l'original
 * (`/upload/` → `/upload/w_800,h_450,c_fill/q_auto/`) et le fallback sur
 * une image par défaut selon la catégorie déduite.
 */
export function getArticleImage(article: Article): string {
  const firstImage = article.images?.[0]?.url;

  if (firstImage) {
    if (firstImage.includes("cloudinary.com")) {
      return firstImage.replace("/upload/", "/upload/w_800,h_450,c_fill/q_auto/");
    }
    return firstImage;
  }

  const category = getArticleCategory(article);
  return DEFAULT_IMAGES_BY_CATEGORY[category] || DEFAULT_ARTICLE_IMAGE;
}
