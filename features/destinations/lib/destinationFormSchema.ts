import { z } from "zod";

import { DESTINATION_CATEGORIES } from "@/types/destination";

const textArrayItemSchema = z.object({ value: z.string() });

const dateRangeItemSchema = z.object({
  debut: z.string().optional(),
  fin: z.string().optional(),
});

export const destinationFormSchema = z.object({
  titre: z.string().trim().min(1, "Le titre est requis."),
  categorie: z.enum(DESTINATION_CATEGORIES, {
    errorMap: () => ({ message: "Merci de choisir une catégorie." }),
  }),
  description: z.string().trim().min(1, "La description est requise."),
  descriptionLongue: z.string().optional(),
  localisation: z.string().trim().min(1, "La localisation est requise."),
  prix: z.coerce.number().min(0, "Le prix ne peut pas être négatif."),
  datesDisponibles: z.array(dateRangeItemSchema),
  pays: z.string().trim().min(1, "Le pays est requis."),
  region: z.string().optional(),
  climat: z.string().optional(),
  fuseauHoraire: z.string().optional(),
  temperatureMin: z.coerce.number().optional(),
  temperatureMax: z.coerce.number().optional(),
  devise: z.string().optional(),
  meilleurePeriode: z.string().optional(),
  budgetJournalier: z.string().optional(),
  aeroport: z.string().optional(),
  langues: z.array(textArrayItemSchema),
  sitesVisiter: z.array(textArrayItemSchema),
  gastronomie: z.array(textArrayItemSchema),
  experiencesCulturelles: z.string().optional(),
  informationsPratiques: z.string().optional(),
  metaDescription: z.string().optional(),
  motsCles: z.string().optional(), // "voyage, culture..." — éclaté à la soumission
  placesDisponibles: z.coerce.number().int().min(1, "Il faut au moins 1 place."),
  featured: z.boolean(),
  /** FileList du champ <input type="file" multiple>, non validé par Zod. */
  images: z.custom<FileList | undefined>().optional(),
});

export type DestinationFormValues = z.infer<typeof destinationFormSchema>;

export const DESTINATION_FORM_DEFAULT_VALUES: DestinationFormValues = {
  titre: "",
  categorie: "weekend",
  description: "",
  descriptionLongue: "",
  localisation: "",
  prix: 0,
  datesDisponibles: [{ debut: "", fin: "" }],
  pays: "",
  region: "",
  climat: "Tropical",
  fuseauHoraire: "GMT+1",
  temperatureMin: 25,
  temperatureMax: 32,
  devise: "Franc CFA (XOF)",
  meilleurePeriode: "Novembre - Mars",
  budgetJournalier: "50-100€",
  aeroport: "",
  langues: [{ value: "Français" }],
  sitesVisiter: [{ value: "" }],
  gastronomie: [{ value: "" }],
  experiencesCulturelles: "",
  informationsPratiques: "",
  metaDescription: "",
  motsCles: "",
  placesDisponibles: 50,
  featured: false,
  images: undefined,
};
