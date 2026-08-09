export interface DestinationImage {
  url: string;
  publicId?: string;
}

export interface DestinationDateRange {
  debut: string;
  fin: string;
}

/**
 * Modèle basé sur l'usage réel observé dans destinations.html et
 * destination_detail.html (le champ "pays" retourné par l'API diffère
 * du hint visuel de la homepage qui affichait des pays en dur).
 */
export interface Destination {
  _id: string;
  titre: string;
  localisation: string;
  pays?: string;
  region?: string;
  categorie?: string;
  climat?: string;
  description?: string;
  descriptionLongue?: string;
  sitesVisiter?: string[];
  experiencesCulturelles?: string;
  gastronomie?: string[];
  informationsPratiques?: string;
  metaDescription?: string;
  motsCles?: string[];
  temperatureMin?: number;
  temperatureMax?: number;
  devise?: string;
  langues?: string[];
  aeroport?: string;
  fuseauHoraire?: string;
  meilleurePeriode?: string;
  budgetJournalier?: string;
  prix?: number;
  placesDisponibles?: number;
  datesDisponibles?: DestinationDateRange[];
  featured?: boolean;
  images: DestinationImage[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DestinationsResponse {
  status: string;
  data: {
    destinations: Destination[];
    total?: number;
  };
}

export interface DestinationResponse {
  status: string;
  data: {
    destination: Destination;
  };
}

/**
 * ⚠️ Le formulaire admin d'origine (admin-dashboard.html) proposait une
 * liste différente ("weekend", "culture", "nature", "aventure", "plage",
 * "montagne", "urbain") de celle du filtre public d'origine
 * (destinations.html : "culture", "weekend", "nature", "urbaine" — avec
 * en plus un "urbaine"/"urbain" incohérent). On retient ici la liste
 * complète du formulaire de création, qui fait autorité sur les valeurs
 * réellement enregistrables. À confirmer avec le backend (enum Mongoose
 * du modèle Destination).
 */
export const DESTINATION_CATEGORIES = [
  "weekend",
  "culture",
  "nature",
  "aventure",
  "plage",
  "montagne",
  "urbain",
] as const;
export type DestinationCategory = (typeof DESTINATION_CATEGORIES)[number];

export const DESTINATION_CATEGORY_LABELS: Record<DestinationCategory, string> = {
  weekend: "Weekend",
  culture: "Culture",
  nature: "Nature",
  aventure: "Aventure",
  plage: "Plage",
  montagne: "Montagne",
  urbain: "Urbain",
};
