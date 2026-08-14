import { ArticleCard } from "@/components/blog/ArticleCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Loader } from "@/components/ui/Loader";
import type { Article } from "@/types/article";

interface ArticlesGridProps {
  articles: Article[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  hasActiveFilter: boolean;
}

export function ArticlesGrid({
  articles,
  isLoading,
  isError,
  onRetry,
  hasActiveFilter,
}: ArticlesGridProps) {
  if (isLoading) {
    return (
      <div className="blog-grid">
        <Loader label="Chargement des articles..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="blog-grid">
        <ErrorState message="Impossible de charger les articles." onRetry={onRetry} />
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="blog-grid">
        <EmptyState
          className="empty-state-card"
          icon={hasActiveFilter ? "🔍" : "📝"}
          title={
            hasActiveFilter ? "Aucun article dans cette catégorie" : "Aucun article disponible"
          }
          message={
            hasActiveFilter
              ? "Essayez une autre catégorie ou revenez plus tard."
              : "Revenez bientôt pour découvrir nos nouveaux articles !"
          }
        />
      </div>
    );
  }

  return (
    <div className="blog-grid">
      {articles.map((article) => (
        <ArticleCard key={article._id} article={article} />
      ))}
    </div>
  );
}
