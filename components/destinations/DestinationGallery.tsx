"use client";

import Image from "next/image";

import type { DestinationImage } from "@/types/destination";

const FALLBACK_GALLERY: DestinationImage[] = [
  { url: "/images/travel.jpg" },
  { url: "/images/porto-novo.webp" },
  { url: "/images/ouidah.jpg" },
];

interface DestinationGalleryProps {
  images: DestinationImage[];
  title: string;
}

/**
 * Reproduit le comportement d'origine : clic sur une miniature = ouverture
 * de l'image en taille réelle dans un nouvel onglet (`window.open`).
 * On saute la première image (déjà utilisée comme image principale du hero).
 */
export function DestinationGallery({ images, title }: DestinationGalleryProps) {
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
          <Image src={image.url} alt={`${title} — image ${index + 1}`} fill sizes="33vw" />
        </button>
      ))}
    </div>
  );
}
