export interface ArticleImage {
  url: string;
  publicId?: string;
}

/**
 * Modèle basé sur l'usage réel observé dans blogs.html.
 * L'API ne renvoie pas de champ "catégorie" explicite : elle est déduite
 * côté client à partir du titre/contenu (voir getArticleCategory), comme
 * dans l'original.
 */
export interface Article {
  _id: string;
  titre: string;
  slug: string;
  contenu: string;
  auteur?: string;
  images: ArticleImage[];
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ArticlesResponse {
  status: string;
  data: {
    articles: Article[];
    total?: number;
  };
}

export interface ArticleResponse {
  status: string;
  data: {
    article: Article;
  };
}

export const ARTICLE_CATEGORIES = ["festival", "exposition", "conference", "voyage", "culture"] as const;
export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

/**
 * Catégories du formulaire admin (POST/PATCH /admin/articles), distinctes
 * des ARTICLE_CATEGORIES ci-dessus qui sont déduites côté client pour le
 * filtrage public — cf. le `<select id="blogCategorie">` de
 * admin-dashboard.html d'origine.
 */
export const ADMIN_ARTICLE_CATEGORIES = [
  "voyage",
  "culture",
  "aventure",
  "conseils",
  "evenements",
  "autre",
] as const;
export type AdminArticleCategory = (typeof ADMIN_ARTICLE_CATEGORIES)[number];

export const ADMIN_ARTICLE_CATEGORY_LABELS: Record<AdminArticleCategory, string> = {
  voyage: "Voyage",
  culture: "Culture",
  aventure: "Aventure",
  conseils: "Conseils",
  evenements: "Événements",
  autre: "Autres",
};

/**
 * Article tel que renvoyé par GET /admin/articles et GET /admin/articles/:id
 * (admin uniquement). Contrairement à l'endpoint public /blog, le backend y
 * expose directement `categorie` et `published` — cf. loadBlogs()/editBlog()
 * dans admin-dashboard.html d'origine.
 */
export interface AdminArticle extends Article {
  categorie?: AdminArticleCategory;
  published: boolean;
  descriptionCourte?: string;
  datePublication?: string;
}

export interface AdminArticlesResponse {
  status: string;
  data: {
    articles: AdminArticle[];
    total?: number;
  };
}

export interface AdminArticleResponse {
  status: string;
  data: {
    article: AdminArticle;
  };
}
