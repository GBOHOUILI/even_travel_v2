"use client";

import Script from "next/script";

/**
 * Charge le SDK JavaScript Kkiapay, qui expose ensuite `openKkiapayWidget`,
 * `addSuccessListener` et `addFailedListener` en global (voir
 * types/kkiapay.d.ts). Placé uniquement sur la page de réservation (pas
 * dans le layout racine) pour ne pas charger ce script tiers sur tout le
 * site.
 */
export function KkiapayScript() {
  return <Script src="https://cdn.kkiapay.me/k.js" strategy="afterInteractive" />;
}
