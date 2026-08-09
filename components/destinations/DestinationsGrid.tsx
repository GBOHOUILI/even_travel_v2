import { DestinationCard } from "@/components/destinations/DestinationCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Loader } from "@/components/ui/Loader";
import type { Destination, DestinationImage } from "@/types/destination";

interface DestinationsGridProps {
  destinations: Destination[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onOpenGallery: (images: DestinationImage[]) => void;
}

export function DestinationsGrid({
  destinations,
  isLoading,
  isError,
  onRetry,
  onOpenGallery,
}: DestinationsGridProps) {
  if (isLoading) {
    return (
      <div className="destinations-grid">
        <Loader label="Chargement des destinations..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="destinations-grid">
        <ErrorState
          message="Impossible de charger les destinations."
          onRetry={onRetry}
        />
      </div>
    );
  }

  if (!destinations || destinations.length === 0) {
    return (
      <div className="destinations-grid">
        <EmptyState message="Aucune destination disponible. Revenez plus tard pour découvrir nos prochaines destinations." />
      </div>
    );
  }

  return (
    <div className="destinations-grid">
      {destinations.map((destination) => (
        <DestinationCard
          key={destination._id}
          destination={destination}
          onOpenGallery={onOpenGallery}
        />
      ))}
    </div>
  );
}
