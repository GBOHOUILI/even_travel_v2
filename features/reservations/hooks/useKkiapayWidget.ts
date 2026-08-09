import { useEffect, useRef } from "react";

import type { KkiapayFailedEvent, KkiapaySuccessEvent, KkiapayWidgetOptions } from "@/types/kkiapay";

interface UseKkiapayWidgetOptions {
  onSuccess: (event: KkiapaySuccessEvent) => void;
  onFailed?: (event: KkiapayFailedEvent) => void;
}

/**
 * Encapsule l'API globale exposée par cdn.kkiapay.me/k.js (voir
 * KkiapayScript). Les callbacks sont gardés à jour via une ref pour ne
 * pas avoir à réenregistrer les listeners à chaque re-render.
 */
export function useKkiapayWidget({ onSuccess, onFailed }: UseKkiapayWidgetOptions) {
  const onSuccessRef = useRef(onSuccess);
  const onFailedRef = useRef(onFailed);
  onSuccessRef.current = onSuccess;
  onFailedRef.current = onFailed;

  useEffect(() => {
    const successHandler = (event: KkiapaySuccessEvent) => onSuccessRef.current(event);
    const failedHandler = (event: KkiapayFailedEvent) => onFailedRef.current?.(event);

    window.addSuccessListener?.(successHandler);
    window.addFailedListener?.(failedHandler);

    return () => {
      window.removeSuccessListener?.(successHandler);
      window.removeFailedListener?.(failedHandler);
    };
  }, []);

  function open(options: KkiapayWidgetOptions) {
    if (typeof window === "undefined" || !window.openKkiapayWidget) {
      throw new Error("Le widget Kkiapay n'est pas encore chargé. Merci de réessayer dans un instant.");
    }
    window.openKkiapayWidget(options);
  }

  return { open };
}
