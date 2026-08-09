"use client";

import Image from "next/image";
import { useState } from "react";

import { ImageCarouselModal } from "@/components/ui/ImageCarouselModal";
import type { ArticleImage } from "@/types/article";

interface ArticleGalleryProps {
  images: ArticleImage[];
  title: string;
}

/**
 * Affiche les images de l'article au-delà de la première (déjà utilisée
 * comme image principale du hero), et ouvre le modal carrousel réutilisable
 * (components/ui/ImageCarouselModal) au clic — une amélioration légère par
 * rapport à l'original qui ouvrait une image unique sans navigation.
 */
export function ArticleGallery({ images, title }: ArticleGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const galleryImages = images.length > 1 ? images.slice(1) : [];

  if (galleryImages.length === 0) return null;

  return (
    <>
      <div className="blog-article-gallery">
        {galleryImages.map((image, index) => (
          <button
            key={image.url + index}
            type="button"
            className="blog-gallery-image-btn"
            onClick={() => setOpenIndex(index)}
            aria-label={`Agrandir ${title} — image ${index + 2}`}
          >
            <Image src={image.url} alt={`${title} — image ${index + 2}`} fill sizes="200px" />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <ImageCarouselModal
          images={galleryImages}
          currentIndex={openIndex}
          alt={title}
          onClose={() => setOpenIndex(null)}
          onIndexChange={setOpenIndex}
        />
      )}
    </>
  );
}
