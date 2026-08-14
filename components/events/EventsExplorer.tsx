"use client";

import { useState } from "react";

import { EventsGrid } from "@/components/events/EventsGrid";
import { EventsSearchBar } from "@/components/events/EventsSearchBar";
import { PageHero } from "@/components/ui/PageHero";
import { useEvents } from "@/features/events/hooks/useEvents";
import {
  DEFAULT_EVENT_FILTERS,
  filterEvents,
  type EventFilters,
} from "@/features/events/lib/filterEvents";

export function EventsExplorer() {
  const { data: events, isLoading, isError, refetch } = useEvents();
  const [filters, setFilters] = useState<EventFilters>(DEFAULT_EVENT_FILTERS);

  const filteredEvents = events ? filterEvents(events, filters) : undefined;

  return (
    <>
      <PageHero
        title="Tous les Événements"
        subtitle="Vivez des expériences culturelles et touristiques inoubliables"
        backgroundImage="/images/evenement.jpeg"
      >
        <EventsSearchBar filters={filters} onChange={setFilters} />
      </PageHero>

      <section className="events-listing-section">
        <div className="container">
          <h2 className="section-title">Nos Événements</h2>
          <p className="section-subtitle">
            Découvrez une sélection d&apos;événements culturels exceptionnels à travers
            l&apos;Afrique et le monde
          </p>

          <EventsGrid
            events={filteredEvents}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
          />
        </div>
      </section>
    </>
  );
}
