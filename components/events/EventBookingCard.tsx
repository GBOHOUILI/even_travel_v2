import Link from "next/link";

import { EVENT_CATEGORY_LABELS, type Event, type EventCategory } from "@/types/event";

interface EventBookingCardProps {
  event: Event;
}

function formatLanguages(langues?: string | string[]): string {
  if (!langues) return "Non spécifié";
  return Array.isArray(langues) ? langues.join(", ") : langues;
}

function formatGroupSize(event: Event): string {
  if (event.tailleGroupeMin && event.tailleGroupeMax) {
    return `${event.tailleGroupeMin}-${event.tailleGroupeMax} personnes`;
  }
  if (event.placesTotales) {
    return `Max ${event.placesTotales} personnes`;
  }
  return "Non spécifié";
}

export function EventBookingCard({ event }: EventBookingCardProps) {
  const categoryLabel = event.categorie
    ? (EVENT_CATEGORY_LABELS[event.categorie as EventCategory] ?? event.categorie)
    : "Non spécifié";

  return (
    <aside className="booking-card" id="booking-card">
      <div className="price-tag">
        <span className="eyebrow">Tarif</span>
        <p className="price-value">{event.prix ? event.prix.toLocaleString("fr-FR") : "0"}</p>
        <p>Par personne</p>
      </div>

      <div className="booking-info">
        <div className="info-row">
          <span className="info-label">⏱️ Durée</span>
          <span className="info-value">
            {event.duree ? `${event.duree} jour${event.duree > 1 ? "s" : ""}` : "Non spécifié"}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">👥 Groupe</span>
          <span className="info-value">{formatGroupSize(event)}</span>
        </div>
        <div className="info-row">
          <span className="info-label">🗣️ Langue</span>
          <span className="info-value">{formatLanguages(event.langues)}</span>
        </div>
        <div className="info-row">
          <span className="info-label">💪 Difficulté</span>
          <span className="info-value">{event.difficulte || "Non spécifié"}</span>
        </div>
        {event.date && (
          <div className="info-row">
            <span className="info-label">📅 Départ</span>
            <span className="info-value">
              {new Date(event.date).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}
        <div className="info-row">
          <span className="info-label">🎯 Type</span>
          <span className="info-value">{categoryLabel}</span>
        </div>
        <div className="info-row">
          <span className="info-label">🏛️ Catégorie</span>
          <span className="info-value">{categoryLabel}</span>
        </div>
      </div>

      <Link
        href={`/reservation?type=event&id=${event._id}&nom=${encodeURIComponent(event.nom || "Événement")}`}
        className="book-button"
      >
        Réserver maintenant
      </Link>

      <p className="confirmation-note">Confirmation sous 24h</p>
    </aside>
  );
}
