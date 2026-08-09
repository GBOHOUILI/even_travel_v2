"use client";

import { CommentForm } from "@/components/blog/CommentForm";
import { CommentList } from "@/components/blog/CommentList";
import { ErrorState } from "@/components/ui/ErrorState";
import { Loader } from "@/components/ui/Loader";
import { useArticleComments } from "@/features/blog/hooks/useArticleComments";

export function CommentsSection({ slug }: { slug: string }) {
  const { data: comments, isLoading, isError, refetch } = useArticleComments(slug);

  return (
    <section className="blog-comments">
      <h3>Commentaires {comments ? `(${comments.length})` : ""}</h3>

      <CommentForm slug={slug} />

      {isLoading && <Loader label="Chargement des commentaires..." />}
      {isError && <ErrorState message="Impossible de charger les commentaires." onRetry={() => refetch()} />}
      {comments && <CommentList comments={comments} />}
    </section>
  );
}
