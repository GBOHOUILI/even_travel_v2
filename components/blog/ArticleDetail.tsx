import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import type { ReactNode } from "react";

import { ArticleGallery } from "@/components/blog/ArticleGallery";
import { ARTICLE_CATEGORY_LABELS, getArticleCategory, getArticleImage } from "@/features/blog/lib/articleCategory";
import { formatRelativeDate } from "@/features/blog/lib/formatters";
import type { Article } from "@/types/article";

interface ArticleDetailProps {
  article: Article;
  commentCount: number;
  children?: ReactNode;
}

export function ArticleDetail({ article, commentCount, children }: ArticleDetailProps) {
  const category = getArticleCategory(article);
  const imageUrl = getArticleImage(article);
  const formattedDate = formatRelativeDate(article.publishedAt || article.createdAt);

  // L'API renvoie du HTML brut pour le contenu de l'article (rédigé par
  // les administrateurs, pas par l'utilisateur final) ; on l'assainit
  // tout de même avant injection dans le DOM, par principe de sécurité
  // (voir cahier des charges : "aucune donnée utilisateur injectée
  // directement dans le DOM").
  const safeContent = DOMPurify.sanitize(article.contenu || "<p>Contenu non disponible.</p>");

  return (
    <article className="blog-article-view">
      <div className="blog-article-hero">
        <Image src={imageUrl} alt={article.titre || "Article"} fill sizes="900px" priority />
        <div className="blog-article-hero-overlay" />
      </div>

      <h1>{article.titre || "Sans titre"}</h1>

      <div className="blog-article-meta">
        <div className="blog-article-tags">
          <span className="blog-article-tag">{ARTICLE_CATEGORY_LABELS[category]}</span>
          <span className="blog-article-tag">{formattedDate}</span>
          <span className="blog-article-tag">{article.auteur || "Anonyme"}</span>
        </div>
        <div className="blog-comment-count">
          <i className="fas fa-comment" aria-hidden="true" />
          {commentCount} commentaire{commentCount !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="blog-article-body">
        <div dangerouslySetInnerHTML={{ __html: safeContent }} />
        <ArticleGallery images={article.images ?? []} title={article.titre} />
      </div>

      {children}
    </article>
  );
}
