"use client";

import Image from "next/image";
import { useCallback, useEffect } from "react";

export interface CarouselImage {
  url: string;
  publicId?: string;
}

interface ImageCarouselModalProps {
  images: CarouselImage[];
  currentIndex: number;
  alt: string;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

/**
 * Modal plein écran pour parcourir les images d'une destination / d'un
 * événement. Remplace le carrousel dupliqué en JS vanilla dans
 * destinations.html (id="carouselModal").
 */
export function ImageCarouselModal({
  images,
  currentIndex,
  alt,
  onClose,
  onIndexChange,
}: ImageCarouselModalProps) {
  const goToPrev = useCallback(() => {
    onIndexChange(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  }, [currentIndex, images.length, onIndexChange]);

  const goToNext = useCallback(() => {
    onIndexChange(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, images.length, onIndexChange]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, goToPrev, goToNext]);

  if (images.length === 0) return null;

  const currentImage = images[currentIndex];
  if (!currentImage) return null;

  return (
    <div className="carousel-modal active" role="dialog" aria-modal="true" aria-label="Galerie d'images">
      <button type="button" className="carousel-close" onClick={onClose} aria-label="Fermer la galerie">
        <i className="fas fa-times" aria-hidden="true" />
      </button>

      <div className="carousel-container">
        <div className="carousel-main-image-wrap">
          <Image
            src={currentImage.url}
            alt={alt}
            fill
            className="carousel-main-image"
            sizes="90vw"
            unoptimized
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              className="carousel-nav carousel-prev"
              onClick={goToPrev}
              aria-label="Image précédente"
            >
              <i className="fas fa-chevron-left" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="carousel-nav carousel-next"
              onClick={goToNext}
              aria-label="Image suivante"
            >
              <i className="fas fa-chevron-right" aria-hidden="true" />
            </button>
          </>
        )}

        <div className="carousel-thumbnails">
          {images.map((image, index) => (
            <button
              key={image.url + index}
              type="button"
              className={`carousel-thumbnail-btn ${index === currentIndex ? "active" : ""}`}
              onClick={() => onIndexChange(index)}
              aria-label={`Voir l'image ${index + 1}`}
            >
              <Image
                src={image.url}
                alt={`${alt} — miniature ${index + 1}`}
                width={120}
                height={80}
                className="carousel-thumbnail"
                unoptimized
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
