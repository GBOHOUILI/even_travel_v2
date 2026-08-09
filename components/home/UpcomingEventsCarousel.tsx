"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Loader } from "@/components/ui/Loader";
import { useEvents } from "@/features/events/hooks/useEvents";
import { formatPrice, truncate } from "@/lib/format";
import { useCarousel } from "@/lib/useCarousel";
import { useRevealOnScroll } from "@/lib/useRevealOnScroll";

const ITEM_WIDTH = 280 + 32;

export function UpcomingEventsCarousel() {
  const { data, isLoading, isError, refetch } = useEvents({ limit: 6 });

  // Priorité aux événements "featured", sinon les 6 premiers — logique identique à l'origine.
  const events = useMemo(() => {
    if (!data) return [];
    const featured = data.filter((e) => e.featured);
    return (featured.length >= 3 ? featured : data).slice(0, 6);
  }, [data]);

  const { trackRef, current, goTo, next, prev } = useCarousel({
    itemCount: events.length,
    itemWidth: ITEM_WIDTH,
  });

  useRevealOnScroll([".event.fade-in"], [events.length]);

  return (
    <section className="events-section">
      <div className="container">
        <h3 className="section-title">Événements à venir</h3>
        <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: "var(--spacing-lg)" }}>
          Ne manquez pas nos prochains événements culturels et touristiques
        </p>
      </div>

      <div className="events-carousel-wrap">
        <div className="events-carousel-controls">
          <button type="button" className="events-ctrl" aria-label="Précédent" onClick={prev}>
            ◀
          </button>
          <button type="button" className="events-ctrl" aria-label="Suivant" onClick={next}>
            ▶
          </button>
        </div>

        {isLoading && <Loader label="Chargement des événements..." />}

        {isError && (
          <ErrorState
            message="Impossible de charger les événements."
            fallbackHref="/events"
            fallbackLabel="Voir tous les événements"
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !isError && events.length === 0 && (
          <EmptyState message="Aucun événement disponible pour le moment." />
        )}

        {!isLoading && !isError && events.length > 0 && (
          <>
            <div className="events-carousel-track" ref={trackRef} aria-live="polite">
              {events.map((event, i) => (
                <div className={`event fade-in ${i === current ? "active" : ""}`} key={event._id}>
                  <Link href={`/events/${event._id}`}>
                    <Image
                      src={event.images?.[0]?.url || "/images/default-event.jpg"}
                      alt={event.nom || "Événement"}
                      width={280}
                      height={200}
                      loading="lazy"
                    />
                    <h4>{event.nom || "Événement"}</h4>
                    <p>{truncate(event.description, 80)}</p>
                    {event.lieu && (
                      <p>
                        <i className="fas fa-map-marker-alt" style={{ color: "var(--ochre)", marginRight: 6 }} />
                        {event.lieu}
                      </p>
                    )}
                    <p className="event-price-tag">{formatPrice(event.prix)}</p>
                  </Link>
                  <p>
                    <Link href={`/reservation?type=event&id=${event._id}`}>
                      <button className="btn-primary" style={{ margin: "8px 16px 16px" }}>
                        Réserver maintenant
                      </button>
                    </Link>
                  </p>
                </div>
              ))}
            </div>

            <div className="events-dots">
              {events.map((event, i) => (
                <button
                  type="button"
                  key={event._id}
                  className={`events-dot ${i === current ? "active" : ""}`}
                  aria-label={`Aller à l'événement ${i + 1}`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <Link href="/events">
        <button className="events-button">Découvrez tous les événements</button>
      </Link>
    </section>
  );
}
