"use client";

import { useEffect } from "react";

/**
 * Reproduit le comportement du script "===== INTERSECTION OBSERVER ====="
 * de l'ancienne page : ajoute la classe `visible` aux éléments correspondant
 * au(x) sélecteur(s) donné(s) dès qu'ils entrent dans le viewport.
 *
 * `deps` permet de relancer l'observation quand de nouveaux éléments sont
 * injectés dynamiquement (ex: après le chargement des événements).
 */
export function useRevealOnScroll(selectors: string[], deps: unknown[] = []) {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.12 },
    );

    const elements = document.querySelectorAll(selectors.join(", "));
    elements.forEach((el) => io.observe(el));

    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
