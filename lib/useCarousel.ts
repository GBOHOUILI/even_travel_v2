"use client";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseCarouselOptions {
  itemCount: number;
  itemWidth?: number;
  autoplayMs?: number;
}

export function useCarousel({ itemCount, autoplayMs = 4200 }: UseCarouselOptions) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);
  const pausedByInteraction = useRef(false);
  const resumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Centre la slide `index` en scrollant UNIQUEMENT le track (scrollLeft),
  // jamais la page : contrairement à scrollIntoView(), ce calcul ne touche
  // pas à l'axe vertical, donc aucun risque de "sauter" à la section suivante.
  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const target = track.children[index] as HTMLElement | undefined;
    if (!target) return;

    const offset = target.offsetLeft - (track.clientWidth - target.clientWidth) / 2;

    track.scrollTo({ left: offset, behavior: "smooth" });
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (itemCount === 0) return;
      const clamped = ((index % itemCount) + itemCount) % itemCount;
      scrollToIndex(clamped);
    },
    [itemCount, scrollToIndex],
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Détecte la slide la plus centrée (scroll natif, swipe tactile, drag souris,
  // ou goTo()) pour garder `current` synchronisé dans tous les cas.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || itemCount === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (!best || entry.intersectionRatio > best.intersectionRatio) best = entry;
        }
        if (best && best.intersectionRatio > 0.5) {
          const index = Array.from(track.children).indexOf(best.target);
          if (index !== -1) setCurrent(index);
        }
      },
      { root: track, threshold: [0.5, 0.6, 0.7, 0.8, 0.9, 1] },
    );

    Array.from(track.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [itemCount]);

  function pauseInteraction() {
    pausedByInteraction.current = true;
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(() => {
      pausedByInteraction.current = false;
    }, 5000);
  }

  // Drag à la souris (desktop) : même sensation que le swipe tactile natif.
  // Le tactile est ignoré ici, il a déjà son scroll natif avec momentum.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function onPointerDown(e: PointerEvent) {
      if (e.pointerType === "touch") return;
      isDragging.current = true;
      pauseInteraction();
      dragStartX.current = e.clientX;
      dragStartScroll.current = track!.scrollLeft;
      track!.classList.add("is-dragging");
      track!.setPointerCapture(e.pointerId);
    }
    function onPointerMove(e: PointerEvent) {
      if (!isDragging.current) return;
      const delta = e.clientX - dragStartX.current;
      track!.scrollLeft = dragStartScroll.current - delta;
    }
    function onPointerUp(e: PointerEvent) {
      if (!isDragging.current) return;
      isDragging.current = false;
      track!.classList.remove("is-dragging");
      track!.releasePointerCapture(e.pointerId);
    }

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", onPointerUp);
    track.addEventListener("pointercancel", onPointerUp);
    track.addEventListener("touchstart", pauseInteraction, { passive: true });

    return () => {
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", onPointerUp);
      track.removeEventListener("pointercancel", onPointerUp);
      track.removeEventListener("touchstart", pauseInteraction);
      if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    };
  }, []);

  // Autoplay, pausé quand l'onglet est masqué OU pendant/juste après une interaction
  useEffect(() => {
    if (itemCount === 0) return;
    let interval: ReturnType<typeof setInterval> | undefined;

    function tick() {
      if (!pausedByInteraction.current) {
        setCurrent((c) => {
          const n = (c + 1) % itemCount;
          scrollToIndex(n);
          return n;
        });
      }
    }
    function start() {
      interval = setInterval(tick, autoplayMs);
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
  }, [itemCount, autoplayMs, scrollToIndex]);

  return { trackRef, current, goTo, next, prev };
}
