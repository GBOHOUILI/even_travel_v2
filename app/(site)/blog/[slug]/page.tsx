import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleDetail } from "@/components/blog/ArticleDetail";
import { CommentsSection } from "@/components/blog/CommentsSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { blogApi } from "@/features/blog/api/blog.api";
import { createExcerpt } from "@/features/blog/lib/formatters";
import { ApiError } from "@/lib/api";
import { canonicalUrl } from "@/lib/seo";
import { buildArticleSchema, buildBreadcrumbSchema } from "@/lib/structuredData";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

async function getArticleOrNotFound(slug: string) {
  try {
    return await blogApi.getBySlug(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const article = await blogApi.getBySlug(slug);
    const description = createExcerpt(article.contenu || "", 160);
    return {
      title: article.titre,
      description,
      alternates: { canonical: canonicalUrl(`/blog/${slug}`) },
      openGraph: {
        title: article.titre,
        description,
        images: article.images?.[0]?.url ? [article.images[0].url] : undefined,
      },
    };
  } catch {
    return { title: "Article" };
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleOrNotFound(slug);

  // Le compteur affiché dans l'en-tête de l'article est fetché côté
  // serveur pour le premier rendu (SEO/no-JS) ; la section commentaires
  // (liste + formulaire) reste un Client Component pour l'interactivité
  // (React Query + mutation).
  const comments = await blogApi.getComments(slug).catch(() => []);
  const url = canonicalUrl(`/blog/${slug}`);

  const breadcrumbItems = [
    { name: "Accueil", url: canonicalUrl("/") },
    { name: "Blog", url: canonicalUrl("/blog") },
    { name: article.titre, url },
  ];

  return (
    <>
      <JsonLd data={buildArticleSchema(article, url)} />
      <JsonLd data={buildBreadcrumbSchema(breadcrumbItems)} />
      <Breadcrumbs
        items={[
          { label: "Accueil", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: article.titre },
        ]}
      />
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "var(--spacing-xl) 40px" }}>
        <ArticleDetail article={article} commentCount={comments.length}>
          <CommentsSection slug={slug} />
        </ArticleDetail>
      </main>
    </>
  );
}
