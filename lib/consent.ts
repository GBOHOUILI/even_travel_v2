export const CONSENT_STORAGE_KEY = "et_cookie_consent";
export const CONSENT_VERSION = 1;
export const OPEN_COOKIE_SETTINGS_EVENT = "et:open-cookie-settings";
export const CONSENT_CHANGED_EVENT = "et:consent-changed";

export type ConsentChoices = { analytics: boolean; marketing: boolean };
export type StoredConsent = ConsentChoices & { version: number; savedAt: string };

export function readConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if (parsed.version !== CONSENT_VERSION) return null;
    return {
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
      version: CONSENT_VERSION,
      savedAt: parsed.savedAt ?? "",
    };
  } catch {
    return null;
  }
}

export function saveConsent(choices: ConsentChoices): void {
  const value: StoredConsent = {
    analytics: choices.analytics,
    marketing: choices.marketing,
    version: CONSENT_VERSION,
    savedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* stockage indisponible : le choix ne sera pas mémorisé */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: value }));
}

/** À utiliser avant de charger tout script de mesure d'audience ou de ciblage. */
export function hasConsent(category: keyof ConsentChoices): boolean {
  return readConsent()?.[category] === true;
}

export function openCookieSettings(): void {
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
}
