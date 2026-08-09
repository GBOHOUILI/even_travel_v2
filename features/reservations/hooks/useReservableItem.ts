import { useQuery } from "@tanstack/react-query";

import { destinationsApi } from "@/features/destinations/api/destinations.api";
import { eventsApi } from "@/features/events/api/events.api";
import type { ReservationType } from "@/types/reservation";

export interface ReservableItem {
  _id: string;
  nom: string;
  lieu: string;
  prix: number;
  placesDisponibles: number;
  /** Première date disponible, au format ISO, si connue. */
  date?: string;
}

function normalizeItem(type: ReservationType, item: unknown): ReservableItem {
  if (type === "event") {
    const event = item as {
      _id: string;
      nom: string;
      lieu?: string;
      prix?: number;
      placesRestantes?: number;
      date?: string;
    };
    return {
      _id: event._id,
      nom: event.nom,
      lieu: event.lieu || "Non spécifié",
      prix: event.prix || 0,
      placesDisponibles: event.placesRestantes ?? 50,
      date: event.date,
    };
  }

  const destination = item as {
    _id: string;
    titre: string;
    localisation?: string;
    prix?: number;
    placesDisponibles?: number;
    datesDisponibles?: { debut: string; fin: string }[];
  };
  return {
    _id: destination._id,
    nom: destination.titre,
    lieu: destination.localisation || "Non spécifié",
    prix: destination.prix || 0,
    placesDisponibles: destination.placesDisponibles ?? 50,
    date: destination.datesDisponibles?.[0]?.debut,
  };
}

/**
 * Charge l'événement ou la destination réservé(e), selon les paramètres
 * `type`/`id` de l'URL, et normalise la forme des champs qui diffèrent
 * entre les deux modèles (nom/titre, lieu/localisation, placesRestantes/
 * placesDisponibles), comme le faisait `chargerDetailsReservation()` dans
 * l'original.
 */
export function useReservableItem(type: ReservationType | undefined, id: string | undefined) {
  return useQuery({
    queryKey: ["reservable-item", type, id],
    queryFn: async () => {
      if (!type || !id) throw new Error("Type ou identifiant manquant.");
      const item = type === "event" ? await eventsApi.getById(id) : await destinationsApi.getById(id);
      return normalizeItem(type, item);
    },
    enabled: Boolean(type && id),
  });
}
