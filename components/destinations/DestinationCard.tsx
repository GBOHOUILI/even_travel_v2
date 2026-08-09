import Image from "next/image";
import Link from "next/link";

import { DESTINATION_CATEGORY_LABELS, type Destination } from "@/types/destination";

const DEFAULT_IMAGE = "/images/travel.jpg";

function formatDestinationPrice(prix?: number): string {
  if (!prix) return "Gratuit";
  return `À partir de ${prix.toLocaleString("fr-FR")} FCFA`;
}

function formatDateRange(destination: Destination): string {
  const firstRange = destination.datesDisponibles?.[0];
  if (!firstRange?.debut || !firstRange?.fin) return "Dates flexibles";

  const format = (iso: string) =>
    new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

  return `${format(firstRange.debut)} - ${format(firstRange.fin)}`;
}

interface DestinationCardProps {
  destination: Destination;
  onOpenGallery: (images: Destination["images"]) => void;
}

export function DestinationCard({ destination, onOpenGallery }: DestinationCardProps) {
  const images = destination.images ?? [];
  const hasMultipleImages = images.length > 1;
  const mainImageUrl = images[0]?.url || DEFAULT_IMAGE;
  const categoryLabel = destination.categorie
    ? DESTINATION_CATEGORY_LABELS[destination.categorie as keyof typeof DESTINATION_CATEGORY_LABELS] ??
      destination.categorie
    : "Non catégorisé";

  return (
    <article className="destination-card visible">
      <div
        className="destination-image-container"
        onClick={() => images.length > 0 && onOpenGallery(images)}
        role="button"
        tabIndex={0}
        aria-label={`Voir la galerie de ${destination.titre}`}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && images.length > 0) onOpenGallery(images);
        }}
      >
        {destination.featured && <span className="destination-featured">⭐ En vedette</span>}
        <Image src={mainImageUrl} alt={destination.titre} fill sizes="(max-width: 768px) 100vw, 33vw" />
        {hasMultipleImages && (
          <div className="image-counter">
            <i className="fas fa-images" aria-hidden="true" />
            <span>{images.length}</span>
          </div>
        )}
      </div>

      <div className="destination-details">
        <h3 className="destination-title">{destination.titre || "Destination sans titre"}</h3>

        <div className="destination-info">
          <div className="destination-info-item">
            <i className="fas fa-map-marker-alt" aria-hidden="true" />
            <span>{destination.localisation || "Localisation non spécifiée"}</span>
          </div>
          <div className="destination-info-item">
            <i className="fas fa-calendar-alt" aria-hidden="true" />
            <span>{formatDateRange(destination)}</span>
          </div>
          <div className="destination-info-item">
            <i className="fas fa-tag" aria-hidden="true" />
            <span>{categoryLabel}</span>
          </div>
          <div className="destination-info-item">
            <i className="fas fa-users" aria-hidden="true" />
            <span>{destination.placesDisponibles ?? 0} places disponibles</span>
          </div>
        </div>

        <div className="destination-price">{formatDestinationPrice(destination.prix)}</div>

        <div className="destination-buttons">
          <Link href={`/destinations/${destination._id}`} className="btn-details">
            Détails
          </Link>
          <Link href={`/reservation?type=destination&id=${destination._id}`} className="btn-reserve">
            Réserver
          </Link>
        </div>
      </div>
    </article>
  );
}
