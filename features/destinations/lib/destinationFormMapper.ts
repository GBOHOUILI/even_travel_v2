import type { DestinationFormValues } from "@/features/destinations/lib/destinationFormSchema";
import type { Destination } from "@/types/destination";

const SIMPLE_FIELDS = [
  "titre",
  "categorie",
  "description",
  "descriptionLongue",
  "localisation",
  "pays",
  "region",
  "climat",
  "fuseauHoraire",
  "devise",
  "meilleurePeriode",
  "budgetJournalier",
  "aeroport",
  "experiencesCulturelles",
  "informationsPratiques",
  "metaDescription",
] as const satisfies readonly (keyof DestinationFormValues)[];

/**
 * Construit le FormData multipart envoyé à POST/PATCH /destinations.
 * Contrairement aux événements, le backend attend des champs FormData
 * individuels (pas un blob `data` en JSON) — cf. saveDestination() dans
 * admin-dashboard.html.
 */
export function buildDestinationFormData(values: DestinationFormValues): FormData {
  const formData = new FormData();

  const imageFiles = values.images;
  if (imageFiles?.length) {
    Array.from(imageFiles)
      .slice(0, 5)
      .forEach((file) => formData.append("images", file));
  }

  SIMPLE_FIELDS.forEach((field) => {
    formData.append(field, (values[field] as string | undefined) || "");
  });

  formData.append("prix", String(values.prix || 0));
  formData.append("placesDisponibles", String(values.placesDisponibles || 50));
  formData.append("featured", String(values.featured));
  formData.append("temperatureMin", String(values.temperatureMin ?? 25));
  formData.append("temperatureMax", String(values.temperatureMax ?? 32));

  const datesDisponibles = values.datesDisponibles
    .filter((d) => d.debut && d.fin)
    .map((d) => ({
      debut: new Date(d.debut as string).toISOString(),
      fin: new Date(d.fin as string).toISOString(),
    }));
  if (datesDisponibles.length)
    formData.append("datesDisponibles", JSON.stringify(datesDisponibles));

  const langues = values.langues.map((l) => l.value.trim()).filter(Boolean);
  if (langues.length) formData.append("langues", JSON.stringify(langues));

  const sitesVisiter = values.sitesVisiter.map((s) => s.value.trim()).filter(Boolean);
  if (sitesVisiter.length) formData.append("sitesVisiter", JSON.stringify(sitesVisiter));

  const gastronomie = values.gastronomie.map((g) => g.value.trim()).filter(Boolean);
  if (gastronomie.length) formData.append("gastronomie", JSON.stringify(gastronomie));

  const motsCles = values.motsCles
    ? values.motsCles
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean)
    : [];
  if (motsCles.length) formData.append("motsCles", JSON.stringify(motsCles));

  return formData;
}

/** Pré-remplissage du formulaire à partir d'une destination existante (édition). */
export function destinationToFormValues(destination: Destination): DestinationFormValues {
  return {
    titre: destination.titre || "",
    categorie: (destination.categorie as DestinationFormValues["categorie"]) || "weekend",
    description: destination.description || "",
    descriptionLongue: destination.descriptionLongue || "",
    localisation: destination.localisation || "",
    prix: destination.prix || 0,
    datesDisponibles: destination.datesDisponibles?.length
      ? destination.datesDisponibles.map((d) => ({
          debut: d.debut ? new Date(d.debut).toISOString().split("T")[0] : "",
          fin: d.fin ? new Date(d.fin).toISOString().split("T")[0] : "",
        }))
      : [{ debut: "", fin: "" }],
    pays: destination.pays || "",
    region: destination.region || "",
    climat: destination.climat || "Tropical",
    fuseauHoraire: destination.fuseauHoraire || "GMT+1",
    temperatureMin: destination.temperatureMin ?? 25,
    temperatureMax: destination.temperatureMax ?? 32,
    devise: destination.devise || "Franc CFA (XOF)",
    meilleurePeriode: destination.meilleurePeriode || "Novembre - Mars",
    budgetJournalier: destination.budgetJournalier || "50-100€",
    aeroport: destination.aeroport || "",
    langues: destination.langues?.length
      ? destination.langues.map((v) => ({ value: v }))
      : [{ value: "Français" }],
    sitesVisiter: destination.sitesVisiter?.length
      ? destination.sitesVisiter.map((v) => ({ value: v }))
      : [{ value: "" }],
    gastronomie: destination.gastronomie?.length
      ? destination.gastronomie.map((v) => ({ value: v }))
      : [{ value: "" }],
    experiencesCulturelles: destination.experiencesCulturelles || "",
    informationsPratiques: destination.informationsPratiques || "",
    metaDescription: destination.metaDescription || "",
    motsCles: destination.motsCles?.join(", ") || "",
    placesDisponibles: destination.placesDisponibles || 50,
    featured: destination.featured || false,
    images: undefined,
  };
}
