export const EVENT_CATEGORY_OPTIONS = [
  { value: "all", label: "Toutes les catégories" },
  { value: "concert", label: "Concert" },
  { value: "festival", label: "Festival" },
  { value: "culture", label: "Culturel" },
  { value: "sport", label: "Sportif" },
  { value: "excursion", label: "Excursion" },
  { value: "formation", label: "Formation" },
  { value: "soiree", label: "Soirée" },
  { value: "autre", label: "Autre" },
] as const;

export const EVENT_DIFFICULTY_OPTIONS = [
  { value: "all", label: "Toutes difficultés" },
  { value: "Très facile", label: "Très facile" },
  { value: "Facile", label: "Facile" },
  { value: "Modérée", label: "Modérée" },
  { value: "Difficile", label: "Difficile" },
  { value: "Très difficile", label: "Très difficile" },
] as const;
