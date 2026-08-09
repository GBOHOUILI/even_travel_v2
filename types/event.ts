export interface EventImage {
  url: string;
  publicId?: string;
}

export interface ItineraryDay {
  jour: number;
  titre?: string;
  description?: string;
  activites?: string[];
}

/**
 * Modèle basé sur l'usage réel observé dans events.html et
 * event_detail.html.
 */
export interface Event {
  _id: string;
  nom: string;
  categorie?: string;
  difficulte?: string;
  lieu?: string;
  date?: string;
  dateFin?: string;
  prix?: number;
  duree?: number;
  tailleGroupeMin?: number;
  tailleGroupeMax?: number;
  placesRestantes?: number;
  placesTotales?: number;
  langues?: string | string[];
  description?: string;
  descriptionLongue?: string;
  momentsForts?: string[];
  itineraire?: ItineraryDay[];
  servicesInclus?: string[];
  servicesNonInclus?: string[];
  informationsPratiques?: string;
  recommandations?: string;
  featured?: boolean;
  images: EventImage[];
  createdAt?: string;
  updatedAt?: string;
}

export interface EventsResponse {
  status: string;
  data: {
    events: Event[];
    total?: number;
  };
}

export interface EventResponse {
  status: string;
  data: {
    event: Event;
  };
}

export const EVENT_CATEGORIES = [
  "concert",
  "festival",
  "culture",
  "sport",
  "excursion",
  "formation",
  "soiree",
  "autre",
] as const;
export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  concert: "Concert",
  festival: "Festival",
  culture: "Culturel",
  sport: "Sportif",
  excursion: "Excursion",
  formation: "Formation",
  soiree: "Soirée",
  autre: "Autre",
};

export const EVENT_DIFFICULTIES = [
  "Très facile",
  "Facile",
  "Modérée",
  "Difficile",
  "Très difficile",
] as const;
export type EventDifficulty = (typeof EVENT_DIFFICULTIES)[number];
