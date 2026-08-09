import { z } from "zod";

import { ADMIN_ARTICLE_CATEGORIES } from "@/types/article";

export const articleFormSchema = z.object({
  titre: z.string().trim().min(1, "Le titre est requis."),
  categorie: z.enum(ADMIN_ARTICLE_CATEGORIES, {
    errorMap: () => ({ message: "Merci de choisir une catégorie." }),
  }),
  auteur: z.string().trim().min(1, "L'auteur est requis."),
  statut: z.enum(["draft", "published"]),
  descriptionCourte: z.string().trim().min(1, "La description courte est requise."),
  contenu: z.string().trim().min(1, "Le contenu est requis."),
  /** FileList du champ <input type="file">, non validé par Zod. */
  images: z.custom<FileList | undefined>().optional(),
});

export type ArticleFormValues = z.infer<typeof articleFormSchema>;

export const ARTICLE_FORM_DEFAULT_VALUES: ArticleFormValues = {
  titre: "",
  categorie: "voyage",
  auteur: "",
  statut: "draft",
  descriptionCourte: "",
  contenu: "",
  images: undefined,
};
