"use client";

import { useState } from "react";

import { DestinationsGrid } from "@/components/destinations/DestinationsGrid";
import { DestinationsSearchBar } from "@/components/destinations/DestinationsSearchBar";
import { ImageCarouselModal } from "@/components/ui/ImageCarouselModal";
import { PageHero } from "@/components/ui/PageHero";
import {
  DEFAULT_DESTINATION_FILTERS,
  filterDestinations,
  type DestinationFilters,
} from "@/features/destinations/lib/filterDestinations";
import { useDestinations } from "@/features/destinations/hooks/useDestinations";
import type { DestinationImage } from "@/types/destination";

export function DestinationsExplorer() {
  const { data: destinations, isLoading, isError, refetch } = useDestinations();
  const [filters, setFilters] = useState<DestinationFilters>(DEFAULT_DESTINATION_FILTERS);
  const [gallery, setGallery] = useState<{ images: DestinationImage[]; index: number } | null>(
    null,
  );

  const filteredDestinations = destinations ? filterDestinations(destinations, filters) : undefined;

  return (
    <>
      <PageHero
        title="Toutes les Destinations"
        subtitle="Découvrez nos destinations africaines uniques"
        backgroundImage="/images/voyage.jpeg"
      >
        <DestinationsSearchBar filters={filters} onChange={setFilters} />
      </PageHero>

      <section className="destinations-listing-section">
        <div className="container">
          <h2 className="section-title">Nos Destinations</h2>
          <p className="section-subtitle">
            Explorez des lieux authentiques et découvrez la richesse culturelle de l&apos;Afrique
          </p>

          <DestinationsGrid
            destinations={filteredDestinations}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
            onOpenGallery={(images) => setGallery({ images, index: 0 })}
          />
        </div>
      </section>

      {gallery && (
        <ImageCarouselModal
          images={gallery.images}
          currentIndex={gallery.index}
          alt="Destination"
          onClose={() => setGallery(null)}
          onIndexChange={(index) => setGallery((prev) => (prev ? { ...prev, index } : prev))}
        />
      )}
    </>
  );
}
