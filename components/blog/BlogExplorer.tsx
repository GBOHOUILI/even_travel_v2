"use client";
import { useMemo, useState } from "react";
import { ArticlesGrid } from "@/components/blog/ArticlesGrid";
import { PageHero } from "@/components/ui/PageHero";
import { BLOG_CATEGORY_OPTIONS } from "@/constants/blog";
import { useArticles } from "@/features/blog/hooks/useArticles";
import { getArticleCategory } from "@/features/blog/lib/articleCategory";
export function BlogExplorer() {
  const { data: articles, isLoading, isError, refetch } = useArticles();
  const [category, setCategory] = useState("all");
  const sortedArticles = useMemo(() => {
    if (!articles) return undefined;
    return [...articles].sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt).getTime();
      const dateB = new Date(b.publishedAt || b.createdAt).getTime();
      return dateB - dateA;
    });
  }, [articles]);
  const filteredArticles = useMemo(() => {
    if (!sortedArticles) return undefined;
    if (category === "all") return sortedArticles;
    return sortedArticles.filter((article) => getArticleCategory(article) === category);
  }, [sortedArticles, category]);
  return (
    <>
      <PageHero
        title="Notre Blog"
        subtitle="Partagez vos impressions"
        backgroundImage="/images/blog.jpeg"
      />
      <main className="blog-intro-section">
        <div className="blog-intro-header">
          <h2 className="blog-intro-title">Événements &amp; Tourisme</h2>
          <p className="blog-intro-subtitle">
            Retrouvez ici des récapitulatifs des événements passés, des photos et l&apos;espace pour
            partager vos impressions
          </p>
        </div>
        <div className="blog-toolbar">
          <h2 className="blog-section-title">Articles récents</h2>
          <div className="blog-filter">
            Filtrer par :
            <select
              aria-label="Filtrer par catégorie"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {BLOG_CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <ArticlesGrid
          articles={filteredArticles}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
          hasActiveFilter={category !== "all"}
        />
      </main>
    </>
  );
}
