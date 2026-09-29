import { apiClient } from "@/lib/api";
import { hasConsent } from "@/lib/consent";

export type AnalyticsEventType = "page_view" | "whatsapp_click" | "form_submit";

interface TrackOptions {
  formName?: string;
}

function getReferrerSource(): string | undefined {
  if (typeof document === "undefined" || !document.referrer) return undefined;
  try {
    const referrerHost = new URL(document.referrer).hostname;
    if (typeof window !== "undefined" && referrerHost === window.location.hostname) {
      return "internal";
    }
    return referrerHost;
  } catch {
    return undefined;
  }
}

/**
 * Envoie un événement de mesure d'audience, uniquement si le visiteur a
 * donné son consentement (bandeau de cookies, catégorie "analytics").
 * Ne bloque jamais et ne fait jamais échouer l'action de l'utilisateur :
 * toute erreur réseau est silencieusement ignorée.
 */
export function trackEvent(
  type: AnalyticsEventType,
  path: string,
  options: TrackOptions = {},
): void {
  if (typeof window === "undefined") return;
  if (!hasConsent("analytics")) return;

  apiClient
    .post("/analytics/track", {
      type,
      path,
      formName: options.formName,
      referrer: getReferrerSource(),
    })
    .catch(() => {
      /* le tracking ne doit jamais perturber l'expérience utilisateur */
    });
}
