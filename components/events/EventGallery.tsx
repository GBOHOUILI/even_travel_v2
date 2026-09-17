"use client";

import Image from "next/image";

import type { EventImage } from "@/types/event";

const FALLBACK_GALLERY: EventImage[] = [
  { url: "/images/evenement.jpeg" },
  { url: "/images/groupe.jpg" },
  { url: "/images/conf.jpg" },
];

interface EventGalleryProps {
  images: EventImage[];
  title: string;
}

/**
 * Même comportement que DestinationGallery : clic sur une miniature =
 * ouverture de l'image en taille réelle dans un nouvel onglet. On saute la
 * première image (déjà utilisée comme image principale du hero).
 */
export function EventGallery({ images, title }: EventGalleryProps) {
  const galleryImages = images.length > 1 ? images.slice(1) : FALLBACK_GALLERY;

  return (
    <div className="gallery-grid">
      {galleryImages.map((image, index) => (
        <button
          key={image.url + index}
          type="button"
          onClick={() => window.open(image.url, "_blank", "noopener,noreferrer")}
          aria-label={`Ouvrir ${title} — image ${index + 1} en plein écran`}
        >
          <Image
            src={image.url}
            alt={`${title} — image ${index + 1}`}
            fill
            sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 300px"
          />
        </button>
      ))}
    </div>
  );
}
