"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { useSubmitComment } from "@/features/blog/hooks/useSubmitComment";
import { commentSchema, type CommentFormValues } from "@/features/blog/lib/commentSchema";
import { useToast } from "@/providers/ToastProvider";

export function CommentForm({ slug }: { slug: string }) {
  const { showToast } = useToast();
  const submitComment = useSubmitComment(slug);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { nom: "", email: "", message: "" },
  });

  const onSubmit = handleSubmit((values) => {
    submitComment.mutate(
      { nom: values.nom, email: values.email || undefined, message: values.message },
      {
        onSuccess: () => {
          showToast("Merci ! Votre commentaire est en attente de modération.", "success");
          reset();
        },
        onError: () => {
          showToast("Une erreur est survenue lors de l'envoi du commentaire.", "error");
        },
      },
    );
  });

  return (
    <form className="blog-comment-form" onSubmit={onSubmit} noValidate>
      <div className="blog-form-row">
        <div>
          <input placeholder="Votre nom *" aria-label="Votre nom" aria-invalid={!!errors.nom} {...register("nom")} />
          {errors.nom && <p className="blog-field-error">{errors.nom.message}</p>}
        </div>
        <div>
          <input
            type="email"
            placeholder="Votre email (optionnel)"
            aria-label="Votre email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && <p className="blog-field-error">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <textarea
          placeholder="Votre commentaire *"
          aria-label="Votre commentaire"
          aria-invalid={!!errors.message}
          {...register("message")}
        />
        {errors.message && <p className="blog-field-error">{errors.message.message}</p>}
      </div>

      <p className="blog-form-hint">
        <i className="fas fa-info-circle" aria-hidden="true" /> Votre commentaire sera soumis à modération avant
        publication.
      </p>

      <div className="blog-comment-actions">
        <Link href="/blog" className="blog-btn blog-btn-secondary">
          <i className="fas fa-arrow-left" aria-hidden="true" /> Retour aux articles
        </Link>
        <button type="submit" className="blog-btn blog-btn-primary" disabled={submitComment.isPending}>
          <i className={`fas ${submitComment.isPending ? "fa-spinner fa-spin" : "fa-paper-plane"}`} aria-hidden="true" />
          {submitComment.isPending ? "Envoi en cours..." : "Publier le commentaire"}
        </button>
      </div>
    </form>
  );
}
