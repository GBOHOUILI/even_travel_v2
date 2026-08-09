import { z } from "zod";

export const profileFormSchema = z.object({
  nom: z.string().trim().min(2, "Le nom doit faire au moins 2 caractères."),
  email: z.string().trim().email("Adresse email invalide."),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Merci de renseigner votre mot de passe actuel."),
    newPassword: z.string().min(6, "Le nouveau mot de passe doit faire au moins 6 caractères."),
    confirmPassword: z.string().min(1, "Merci de confirmer le nouveau mot de passe."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

export type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export const newAdminFormSchema = z
  .object({
    nom: z.string().trim().min(2, "Le nom doit faire au moins 2 caractères."),
    email: z.string().trim().email("Adresse email invalide."),
    password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères."),
    confirmPassword: z.string().min(1, "Merci de confirmer le mot de passe."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

export type NewAdminFormValues = z.infer<typeof newAdminFormSchema>;
