import { formatRelativeDate, getInitials } from "@/features/blog/lib/formatters";
import type { Comment } from "@/types/comment";

export function CommentList({ comments }: { comments: Comment[] }) {
  const approvedComments = comments.filter((comment) => comment.approved);

  if (comments.length === 0) {
    return (
      <div className="empty-state" style={{ padding: "var(--spacing-md)" }}>
        <p>Aucun commentaire pour le moment. Soyez le premier à laisser votre avis !</p>
      </div>
    );
  }

  if (approvedComments.length === 0) {
    return (
      <div className="empty-state" style={{ padding: "var(--spacing-md)" }}>
        <p>Les commentaires sont en attente de validation par notre équipe.</p>
      </div>
    );
  }

  return (
    <div className="blog-comment-list">
      {approvedComments.map((comment) => (
        <div className="blog-comment-item" key={comment._id}>
          <div className="blog-comment-header">
            <div className="blog-comment-avatar">{getInitials(comment.nom)}</div>
            <div className="blog-comment-meta">
              <div className="blog-comment-name">
                {comment.nom}
                <span className="blog-comment-status blog-status-approved">Approuvé</span>
              </div>
              <div className="blog-comment-date">{formatRelativeDate(comment.createdAt)}</div>
            </div>
          </div>
          <div className="blog-comment-text">{comment.message}</div>
        </div>
      ))}
    </div>
  );
}
