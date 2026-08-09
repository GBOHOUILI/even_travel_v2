const STORAGE_KEY = "even-travel:pending-reservation-id";

/**
 * Pendant la redirection vers Moneroo (domaine externe), l'URL de retour
 * (`return_url`) est configurée côté backend et ne contient pas
 * nécessairement l'ID de réservation. On le garde temporairement en
 * localStorage pour pouvoir l'afficher sur la page /paiement même si
 * l'URL de retour ne le transmet pas.
 *
 * ⚠️ Ce n'est PAS un token d'authentification (pas de JWT ici) — juste un
 * identifiant de réservation non sensible, donc conforme à la consigne
 * "jamais de JWT dans localStorage".
 */
export const pendingReservation = {
  save(reservationId: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, reservationId);
  },

  get(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(STORAGE_KEY);
  },

  clear(): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
  },
};
