import { z } from "zod";

/**
 * Règles identiques à validateForm() dans l'original : email/téléphone
 * valides, au moins 1 participant, date future, et un maximum de places
 * qui dépend de l'événement/destination chargé (paramètre dynamique).
 */
export function buildReservationSchema(maxPlaces: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return z.object({
    nom: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères."),
    prenom: z.string().trim().min(2, "Le prénom doit contenir au moins 2 caractères."),
    email: z.string().trim().email("Merci de renseigner une adresse email valide."),
    telephone: z
      .string()
      .trim()
      .regex(/^[+]?[0-9\s\-()]{8,}$/, "Merci de renseigner un numéro de téléphone valide."),
    participants: z
      .number({ invalid_type_error: "Merci d'indiquer un nombre de personnes." })
      .int()
      .min(1, "Au moins 1 participant est requis.")
      .max(maxPlaces, `Maximum ${maxPlaces} place${maxPlaces > 1 ? "s" : ""} disponible${maxPlaces > 1 ? "s" : ""}.`),
    date: z
      .string()
      .min(1, "Merci de sélectionner une date.")
      .refine((value) => new Date(value) >= today, "La date doit être dans le futur."),
    message: z.string().trim().optional(),
    plan: z.enum(["unique", "deux_tranches"]),
    methode: z.enum(["carte", "mtn", "moov"]),
  });
}

export type ReservationFormValues = z.infer<ReturnType<typeof buildReservationSchema>>;
