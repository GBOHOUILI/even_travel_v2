"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseCarouselOptions {
  itemCount: number;
  itemWidth: number; // largeur d'un item + gap, en px (ex: 280 + 32)
  autoplayMs?: number;
}

/**
 * Reproduit la logique des carrousels vanilla JS d'origine (destinations
 * phares & événements à venir) : scroll horizontal fluide, dots cliquables,
 * autoplay pausé quand l'onglet est masqué, navigation flèches clavier.
 */
export function useCarousel({ itemCount, itemWidth, autoplayMs = 4200 }: UseCarouselOptions) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      if (itemCount === 0) return;
      const next = ((index % itemCount) + itemCount) % itemCount;
      setCurrent(next);
      trackRef.current?.scrollTo({ left: next * itemWidth, behavior: "smooth" });
    },
    [itemCount, itemWidth],
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Autoplay, mis en pause quand l'onglet n'est pas visible
  useEffect(() => {
    if (itemCount === 0) return;

    let interval: ReturnType<typeof setInterval> | undefined;

    function start() {
      interval = setInterval(() => goTo(current + 1), autoplayMs);
    }
    function stop() {
      if (interval) clearInterval(interval);
    }

    start();

    function handleVisibility() {
      if (document.hidden) stop();
      else {
        stop();
        start();
      }
    }

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, itemCount, autoplayMs]);

  return { trackRef, current, goTo, next, prev };
}
