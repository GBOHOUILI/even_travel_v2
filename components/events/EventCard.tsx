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

  return (
    <article className="event-card visible">
      <div className="event-image-container">
        <span className="event-category-badge">{translateCategory(event.categorie)}</span>
        {event.featured && <span className="event-featured">⭐ En vedette</span>}
        <Image src={imageUrl} alt={event.nom} fill sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <div className="event-details">
        <h3 className="event-title">{event.nom || "Événement sans titre"}</h3>
        <div className="event-meta-line">
          <i className="fas fa-calendar-alt" aria-hidden="true" />
          <span>{formatEventDate(event.date)}</span>
          <span className="event-meta-dot">•</span>
          <i className="fas fa-map-marker-alt" aria-hidden="true" />
          <span className="event-meta-place">{event.lieu || "Lieu non spécifié"}</span>
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
