import type { EventFormValues } from "@/features/events/lib/eventFormSchema";
import type { Event } from "@/types/event";

/**
 * Payload JSON envoyé dans le champ `data` du FormData multipart
 * (cf. saveEvent() dans admin-dashboard.html — le backend attend un
 * champ `data` en JSON.stringify, pas des champs FormData individuels
 * comme pour les destinations).
 */
export interface EventDataPayload {
  nom: string;
  date: string;
  dateFin: string;
  lieu: string;
  description: string;
  descriptionLongue: string;
  prix: number;
  placesTotales: number;
  placesRestantes: number;
  duree: number;
  tailleGroupeMin: number;
  tailleGroupeMax: number;
  difficulte: string;
  langues: string[];
  categorie: string;
  featured: boolean;
  servicesInclus: string[];
  servicesNonInclus: string[];
  informationsPratiques: string;
  itineraire: { titre: string; description: string; activites: string[] }[];
  momentsForts: string[];
  recommandations: string;
}

function computeDateFin(date: string, dateFin: string | undefined, duree: number): string {
  if (dateFin) return new Date(dateFin).toISOString();
  if (date && duree > 1) {
    const d = new Date(date);
    d.setDate(d.getDate() + duree - 1);
    return d.toISOString();
  }
  return date ? new Date(date).toISOString() : new Date().toISOString();
}

export function buildEventDataPayload(values: EventFormValues): EventDataPayload {
  const langues = values.langues
    ? values.langues
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean)
    : ["Français"];

  return {
    nom: values.nom,
    date: values.date ? new Date(values.date).toISOString() : new Date().toISOString(),
    dateFin: computeDateFin(values.date, values.dateFin, values.duree),
    lieu: values.lieu,
    description: values.description,
    descriptionLongue: values.descriptionLongue || values.description,
    prix: values.prix,
    placesTotales: values.placesTotales,
    placesRestantes: values.placesTotales,
    duree: values.duree,
    tailleGroupeMin: values.tailleGroupeMin || 1,
    tailleGroupeMax: values.tailleGroupeMax || 20,
    difficulte: values.difficulte,
    langues,
    categorie: values.categorie,
    featured: values.featured,
    servicesInclus: values.servicesInclus.map((s) => s.value.trim()).filter(Boolean),
    servicesNonInclus: values.servicesNonInclus.map((s) => s.value.trim()).filter(Boolean),
    informationsPratiques: values.informationsPratiques || "",
    itineraire: values.itineraire
      .filter((j) => j.titre || j.description)
      .map((j) => ({
        titre: j.titre || "",
        description: j.description || "",
        activites: j.activites
          ? j.activites
              .split(",")
              .map((a) => a.trim())
              .filter(Boolean)
          : [],
      })),
    momentsForts: values.momentsForts.map((m) => m.value.trim()).filter(Boolean),
    recommandations: values.recommandations || "",
  };
}

/** Pré-remplissage du formulaire à partir d'un événement existant (édition). */
export function eventToFormValues(event: Event): EventFormValues {
  return {
    nom: event.nom || "",
    categorie: (event.categorie as EventFormValues["categorie"]) || "concert",
    description: event.description || "",
    descriptionLongue: event.descriptionLongue || "",
    date: event.date ? new Date(event.date).toISOString().slice(0, 16) : "",
    dateFin: event.dateFin ? new Date(event.dateFin).toISOString().slice(0, 16) : "",
    duree: event.duree || 1,
    lieu: event.lieu || "",
    prix: event.prix || 0,
    placesTotales: event.placesTotales || 500,
    tailleGroupeMin: event.tailleGroupeMin || 1,
    tailleGroupeMax: event.tailleGroupeMax || 20,
    difficulte: (event.difficulte as EventFormValues["difficulte"]) || "Modérée",
    langues: Array.isArray(event.langues) ? event.langues.join(", ") : event.langues || "",
    servicesInclus: event.servicesInclus?.length
      ? event.servicesInclus.map((v) => ({ value: v }))
      : [{ value: "" }],
    servicesNonInclus: event.servicesNonInclus?.length
      ? event.servicesNonInclus.map((v) => ({ value: v }))
      : [{ value: "" }],
    momentsForts: event.momentsForts?.length
      ? event.momentsForts.map((v) => ({ value: v }))
      : [{ value: "" }],
    itineraire: event.itineraire?.length
      ? event.itineraire.map((j) => ({
          titre: j.titre || "",
          description: j.description || "",
          activites: j.activites?.join(", ") || "",
        }))
      : [{ titre: "", description: "", activites: "" }],
    informationsPratiques: event.informationsPratiques || "",
    recommandations: event.recommandations || "",
    featured: event.featured || false,
    image: undefined,
  };
}

/** Construit le FormData multipart envoyé à POST/PATCH /events. */
export function buildEventFormData(values: EventFormValues): FormData {
  const formData = new FormData();
  const imageFile = values.image?.[0];
  if (imageFile) formData.append("image", imageFile);
  formData.append("data", JSON.stringify(buildEventDataPayload(values)));
  return formData;
}
