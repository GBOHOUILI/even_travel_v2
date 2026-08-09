import { z } from "zod";

import { EVENT_CATEGORIES, EVENT_DIFFICULTIES } from "@/types/event";

const textArrayItemSchema = z.object({ value: z.string() });

const itineraryItemSchema = z.object({
  titre: z.string().optional(),
  description: z.string().optional(),
  activites: z.string().optional(), // saisi comme "Visite, Repas..." puis éclaté à la soumission
});

export const eventFormSchema = z.object({
  nom: z.string().trim().min(1, "Le nom de l'événement est requis."),
  categorie: z.enum(EVENT_CATEGORIES, {
    errorMap: () => ({ message: "Merci de choisir une catégorie." }),
  }),
  description: z.string().trim().min(1, "La description courte est requise."),
  descriptionLongue: z.string().optional(),
  date: z.string().min(1, "La date de début est requise."),
  dateFin: z.string().optional(),
  duree: z.coerce.number().int().min(1, "La durée doit être d'au moins 1 jour."),
  lieu: z.string().trim().min(1, "Le lieu est requis."),
  prix: z.coerce.number().min(0, "Le prix ne peut pas être négatif."),
  placesTotales: z.coerce.number().int().min(1, "Il faut au moins 1 place."),
  tailleGroupeMin: z.coerce.number().int().min(1).optional(),
  tailleGroupeMax: z.coerce.number().int().min(1).optional(),
  difficulte: z.enum(EVENT_DIFFICULTIES),
  langues: z.string().optional(), // "Français, Anglais" — éclaté à la soumission
  servicesInclus: z.array(textArrayItemSchema),
  servicesNonInclus: z.array(textArrayItemSchema),
  momentsForts: z.array(textArrayItemSchema),
  itineraire: z.array(itineraryItemSchema),
  informationsPratiques: z.string().optional(),
  recommandations: z.string().optional(),
  featured: z.boolean(),
  /** FileList du champ <input type="file">, non validé par Zod (voir EventFormModal). */
  image: z.custom<FileList | undefined>().optional(),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

export const EVENT_FORM_DEFAULT_VALUES: EventFormValues = {
  nom: "",
  categorie: "concert",
  description: "",
  descriptionLongue: "",
  date: "",
  dateFin: "",
  duree: 1,
  lieu: "",
  prix: 0,
  placesTotales: 500,
  tailleGroupeMin: 1,
  tailleGroupeMax: 20,
  difficulte: "Modérée",
  langues: "",
  servicesInclus: [{ value: "" }],
  servicesNonInclus: [{ value: "" }],
  momentsForts: [{ value: "" }],
  itineraire: [{ titre: "", description: "", activites: "" }],
  informationsPratiques: "",
  recommandations: "",
  featured: false,
  image: undefined,
};
