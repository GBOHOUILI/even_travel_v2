"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Reproduit le comportement de hamburger.js / hamburger.css en React :
 * ouverture/fermeture du menu mobile, overlay, verrouillage du scroll,
 * fermeture au clic sur un lien, à la touche Échap et au redimensionnement.
 */
export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    function handleResize() {
      if (window.innerWidth > 768) close();
    }

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [close]);

  return { isOpen, open, close, toggle };
}
