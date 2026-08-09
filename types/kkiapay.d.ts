/**
 * Le script https://cdn.kkiapay.me/k.js expose `openKkiapayWidget`,
 * `addSuccessListener` et `addFailedListener` comme fonctions globales
 * une fois chargé (pas de module ES, pas de package npm nécessaire).
 * Voir components/reservation/KkiapayScript.tsx pour le chargement.
 */
export interface KkiapayWidgetOptions {
  amount: number;
  /**
   * Clé PUBLIQUE Kkiapay (jamais la clé privée/secrète).
   * ⚠️ Le SDK JS "vanilla" (celui exposé par cdn.kkiapay.me/k.js) attend
   * `api_key`, PAS `key` — ce dernier nom n'existe que dans le wrapper
   * React `kkiapay-react`, qu'on n'utilise pas ici.
   */
  api_key: string;
  sandbox?: boolean;
  /** Donnée personnalisée transmise en aller-retour (ex: JSON.stringify). */
  data?: string;
  phone?: string;
  email?: string;
  name?: string;
  position?: "center" | "right" | "left";
  theme?: string;
}

export interface KkiapaySuccessEvent {
  transactionId: string;
}

export interface KkiapayFailedEvent {
  transactionId?: string;
  reason?: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    openKkiapayWidget?: (options: KkiapayWidgetOptions) => void;
    addSuccessListener?: (callback: (event: KkiapaySuccessEvent) => void) => void;
    addFailedListener?: (callback: (event: KkiapayFailedEvent) => void) => void;
    removeSuccessListener?: (callback: (event: KkiapaySuccessEvent) => void) => void;
    removeFailedListener?: (callback: (event: KkiapayFailedEvent) => void) => void;
  }
}

export {};
