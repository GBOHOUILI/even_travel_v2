import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Merci de renseigner votre identifiant.")
    .email("Format d'email invalide."),
  password: z.string().min(1, "Merci de renseigner votre mot de passe."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
