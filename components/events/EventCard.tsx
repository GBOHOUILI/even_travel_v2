import Image from "next/image";
import Link from "next/link";

import { EVENT_CATEGORY_LABELS, type Event, type EventCategory } from "@/types/event";

const DEFAULT_IMAGE = "/images/default-event.jpg";

function formatEventPrice(prix?: number): string {
  return prix ? `${prix.toLocaleString("fr-FR")} FCFA` : "Gratuit";
}

function formatEventDate(dateString?: string): string {
  if (!dateString) return "Date à confirmer";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function translateCategory(categorie?: string): string {
  if (!categorie) return "Non catégorisé";
  return EVENT_CATEGORY_LABELS[categorie as EventCategory] ?? categorie;
}

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const imageUrl = event.images?.[0]?.url || DEFAULT_IMAGE;
  const duration = event.duree || 1;

  return (
    <article className="event-card visible">
      <div className="event-image-container">
        {event.featured && <span className="event-featured">⭐ En vedette</span>}
        <Image src={imageUrl} alt={event.nom} fill sizes="(max-width: 768px) 100vw, 33vw" />
      </div>

      <div className="event-details">
        <h3 className="event-title">{event.nom || "Événement sans titre"}</h3>

        <div className="event-tags">
          <span className="event-tag event-duration">
            {duration} jour{duration > 1 ? "s" : ""}
          </span>
          <span className="event-tag event-difficulty">{event.difficulte || "Modérée"}</span>
          <span className="event-tag">{translateCategory(event.categorie)}</span>
        </div>

        <div className="event-info">
          <div className="event-info-item">
            <i className="fas fa-map-marker-alt" aria-hidden="true" />
            <span>{event.lieu || "Lieu non spécifié"}</span>
          </div>
          <div className="event-info-item">
            <i className="fas fa-calendar-alt" aria-hidden="true" />
            <span>{formatEventDate(event.date)}</span>
          </div>
          <div className="event-info-item">
            <i className="fas fa-users" aria-hidden="true" />
            <span>
              {event.tailleGroupeMin || 1}-{event.tailleGroupeMax || 20} personnes
            </span>
          </div>
          {event.placesRestantes !== undefined && (
            <div className="event-info-item">
              <i className="fas fa-ticket-alt" aria-hidden="true" />
              <span>{event.placesRestantes} places restantes</span>
            </div>
          )}
        </div>

        <div className="event-price">{formatEventPrice(event.prix)}</div>

        <div className="event-buttons">
          <Link href={`/events/${event._id}`} className="btn-details">
            Détails
          </Link>
          <Link
            href={`/reservation?type=event&id=${event._id}&nom=${encodeURIComponent(event.nom || "Événement")}`}
            className="btn-reserve"
          >
            Réserver
          </Link>
        </div>
      </div>
    </article>
  );
}
