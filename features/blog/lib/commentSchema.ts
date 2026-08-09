import { z } from "zod";

/**
 * Règles identiques à la validation manuelle de l'original
 * (nom ≥ 2 caractères, message ≥ 10 caractères, email optionnel mais
 * valide s'il est renseigné).
 */
export const commentSchema = z.object({
  nom: z.string().trim().min(2, "Votre nom doit contenir au moins 2 caractères."),
  email: z
    .string()
    .trim()
    .email("Merci de renseigner une adresse email valide.")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().min(10, "Votre commentaire doit contenir au moins 10 caractères."),
});

export type CommentFormValues = z.infer<typeof commentSchema>;
