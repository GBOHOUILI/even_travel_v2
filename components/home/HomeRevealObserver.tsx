"use client";

import { useRevealOnScroll } from "@/lib/useRevealOnScroll";

/**
 * Équivalent du bloc "===== INTERSECTION OBSERVER =====" du script
 * d'origine, appliqué aux éléments statiques de la page (hors carrousels,
 * qui gèrent leur propre observation car leur contenu est dynamique).
 */
export function HomeRevealObserver() {
  useRevealOnScroll([".fade-in", ".grid-images img", ".activity", ".reveal"]);
  return null;
}
