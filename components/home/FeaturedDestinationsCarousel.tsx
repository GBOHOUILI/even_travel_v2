"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import { useCarousel } from "@/lib/useCarousel";
import { useRevealOnScroll } from "@/lib/useRevealOnScroll";

const SLIDES = [
  { src: "/images/ouidah.jpg", alt: "Ouidah", title: "OUIDAH", text: "Patrimoine et histoire" },
  {
    src: "/images/sofitel.webp",
    alt: "Cotonou",
    title: "COTONOU",
    text: "Découvrez la côte & la culture urbaine",
  },
  {
    src: "/images/porto-novo.webp",
    alt: "Porto-Novo",
    title: "PORTO-NOVO",
    text: "Architecture et traditions",
  },
  { src: "/images/nati.jpg", alt: "Natitingou", title: "NATITINGOU", text: "Architecture et traditions" },
  { src: "/images/abomey.jpg", alt: "Abomey", title: "ABOMEY", text: "Architecture et traditions" },
];

const ITEM_WIDTH = 280 + 32; // largeur slide + gap, identique à l'original

export function FeaturedDestinationsCarousel() {
  const { trackRef, current, goTo, next, prev } = useCarousel({
    itemCount: SLIDES.length,
    itemWidth: ITEM_WIDTH,
    autoplayMs: 4200,
  });

  useRevealOnScroll([".slide"]);

  // Navigation clavier flèches gauche/droite, comme dans le script d'origine
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [next, prev]);

  return (
    <section className="carousel-section">
      <div className="container">
        <h3 className="section-title">Destinations Phare</h3>
        <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: "var(--spacing-lg)" }}>
          Explorez nos destinations les plus populaires
        </p>
      </div>

      <div className="carousel-wrap">
        <div className="carousel-controls">
          <button type="button" className="ctrl" aria-label="Précédent" onClick={prev}>
            ◀
          </button>
          <button type="button" className="ctrl" aria-label="Suivant" onClick={next}>
            ▶
          </button>
        </div>

        <div className="carousel-track" ref={trackRef} aria-live="polite">
          {SLIDES.map((slide, i) => (
            <div className={`slide ${i === current ? "active" : ""}`} key={slide.title}>
              <Image src={slide.src} alt={slide.alt} width={280} height={340} />
              <div className="meta">
                <strong>{slide.title}</strong>
                <p>{slide.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="dots">
          {SLIDES.map((slide, i) => (
            <button
              type="button"
              key={slide.title}
              className={`dot ${i === current ? "active" : ""}`}
              aria-label={`Aller à la diapositive ${i + 1}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        <Link href="/destinations">
          <button>Découvrez toutes nos destinations</button>
        </Link>
      </div>
    </section>
  );
}
