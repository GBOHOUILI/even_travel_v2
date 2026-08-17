import Image from "next/image";

import { EventBookingCard } from "@/components/events/EventBookingCard";
import { EventItinerary } from "@/components/events/EventItinerary";
import type { Event } from "@/types/event";

const DEFAULT_IMAGE = "/images/default-event.jpg";

function formatEventDate(event: Event): string {
  if (!event.date) return "Date à confirmer";

  const format = (iso: string) =>
    new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  if (event.dateFin) {
    return `${format(event.date)} - ${format(event.dateFin)}`;
  }
  return format(event.date);
}

export function EventDetail({ event }: { event: Event }) {
  const imageUrl = event.images?.[0]?.url || DEFAULT_IMAGE;
  const hasMomentsForts =
    event.momentsForts && event.momentsForts.filter((m) => m?.trim()).length > 0;
  const hasItinerary = event.itineraire && event.itineraire.length > 0;
  const hasInfosPratiques = Boolean(event.informationsPratiques?.trim());
  const hasRecommandations = Boolean(event.recommandations?.trim());
  const groupLabel =
    event.tailleGroupeMin && event.tailleGroupeMax
      ? `${event.tailleGroupeMin}-${event.tailleGroupeMax} personnes`
      : event.placesTotales
        ? `Max ${event.placesTotales} personnes`
        : "Non spécifié";

  return (
    <>
      <section className="hero-section">
        <Image
          src={imageUrl}
          alt={event.nom}
          cover
          sizes="(max-width: 768px) 100vw, 1400px"
          priority
        />
      </section>

      <section className="main-content">
        <div className="content-left">
          <h1>{event.nom}</h1>
          <div className="event-meta">
            <span className="location">📍 {event.lieu || "Non spécifié"}</span>
            <span className="date">📅 {formatEventDate(event)}</span>
            <span className="capacity">👥 {groupLabel}</span>
          </div>

          <div className="mobile-price-bar">
            <div>
              <span className="mobile-price-bar__label">Tarif</span>
              <span className="mobile-price-bar__value">
                {event.prix ? `${event.prix.toLocaleString("fr-FR")} FCFA` : "Sur demande"}
              </span>
            </div>
            <a href="#booking-card" className="mobile-price-bar__cta">
              Réserver
            </a>
          </div>

          <span className="eyebrow">À propos</span>
          <h2>Description de l&apos;événement</h2>
          <p>{event.descriptionLongue?.trim() || event.description}</p>

          {hasMomentsForts && (
            <div>
              <span className="eyebrow">Moments forts</span>
              <h2>Ce qui rend cet événement unique</h2>
              <div className="moments-forts-container">
                {event
                  .momentsForts!.filter((m) => m?.trim())
                  .map((moment) => (
                    <div className="moment-fort-card" key={moment}>
                      <h4>{moment}</h4>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {hasItinerary && (
            <div>
              <span className="eyebrow">Programme détaillé</span>
              <h2>Itinéraire</h2>
              <EventItinerary itineraire={event.itineraire!} />
            </div>
          )}

          {event.servicesInclus && event.servicesInclus.length > 0 && (
            <div>
              <span className="eyebrow">Services inclus</span>
              <h2>Ce qui est inclus</h2>
              <ul>
                {event.servicesInclus.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </div>
          )}

          {event.servicesNonInclus && event.servicesNonInclus.length > 0 && (
            <div>
              <span className="eyebrow">À prévoir</span>
              <h2>Ce qui n&apos;est pas inclus</h2>
              <ul>
                {event.servicesNonInclus.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </div>
          )}

          {hasInfosPratiques && (
            <div>
              <span className="eyebrow">À savoir avant de partir</span>
              <h2>Informations pratiques</h2>
              <div className="highlight-box">
                <h3>📋 Informations importantes</h3>
                <p>{event.informationsPratiques}</p>
              </div>
            </div>
          )}

          {hasRecommandations && (
            <div className="highlight-box">
              <h3>💡 Recommandations</h3>
              <p>{event.recommandations}</p>
            </div>
          )}
        </div>

        <EventBookingCard event={event} />
      </section>
    </>
  );
}
