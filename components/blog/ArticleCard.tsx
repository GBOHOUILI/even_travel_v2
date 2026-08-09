import Image from "next/image";
import Link from "next/link";

import { ARTICLE_CATEGORY_LABELS, getArticleCategory, getArticleImage } from "@/features/blog/lib/articleCategory";
import { createExcerpt, formatRelativeDate, getInitials } from "@/features/blog/lib/formatters";
import type { Article } from "@/types/article";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const category = getArticleCategory(article);
  const imageUrl = getArticleImage(article);
  const excerpt = createExcerpt(article.contenu || "");
  const formattedDate = formatRelativeDate(article.publishedAt || article.createdAt);
  const authorInitials = getInitials(article.auteur);

  return (
    <Link href={`/blog/${article.slug}`} className="blog-card" style={{ textDecoration: "none" }}>
      <div className="blog-card-image-container">
        <span className="blog-card-category">{ARTICLE_CATEGORY_LABELS[category]}</span>
        <Image src={imageUrl} alt={article.titre || "Article"} fill sizes="(max-width: 768px) 100vw, 33vw" />
        <div className="blog-card-overlay" />
      </div>
      <div className="blog-card-content">
        <h3>{article.titre || "Sans titre"}</h3>
        <p>{excerpt}</p>
        <div className="blog-card-footer">
          <div className="blog-card-author">
            <div className="blog-author-avatar">{authorInitials}</div>
            <div className="blog-card-author-info">
              <div className="blog-card-author-name">{article.auteur || "Anonyme"}</div>
              <div className="blog-card-date">{formattedDate}</div>
            </div>
          </div>
          <span className="blog-read-more">
            Lire <i className="fas fa-arrow-right" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
