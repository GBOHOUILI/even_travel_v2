import { z } from "zod";

export const CONTACT_SUBJECTS = ["Réservation", "Demande d'information", "Partenariat", "Autre"] as const;

/**
 * Règles identiques à la validation manuelle de contact.html d'origine
 * (tous les champs requis, email au format valide).
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Merci de renseigner votre nom complet."),
  email: z.string().trim().min(1, "Merci de renseigner votre email.").email("Merci de renseigner une adresse email valide."),
  subject: z.enum(CONTACT_SUBJECTS, { errorMap: () => ({ message: "Merci de sélectionner un sujet." }) }),
  message: z.string().trim().min(10, "Votre message doit contenir au moins 10 caractères."),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
