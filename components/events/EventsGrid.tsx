import { EventCard } from "@/components/events/EventCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Loader } from "@/components/ui/Loader";
import type { Event } from "@/types/event";

interface EventsGridProps {
  events: Event[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function EventsGrid({ events, isLoading, isError, onRetry }: EventsGridProps) {
  if (isLoading) {
    return (
      <div className="events-grid">
        <Loader label="Chargement des événements..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="events-grid">
        <ErrorState message="Impossible de charger les événements." onRetry={onRetry} />
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="events-grid">
        <EmptyState message="Aucun événement disponible. Revenez plus tard pour découvrir nos prochains événements." />
      </div>
    );
  }

  return (
    <div className="events-grid">
      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
}
