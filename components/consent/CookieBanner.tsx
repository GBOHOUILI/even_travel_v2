"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  OPEN_COOKIE_SETTINGS_EVENT,
  readConsent,
  saveConsent,
  type ConsentChoices,
} from "@/lib/consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    // Lecture après le montage : évite tout écart d'hydratation SSR/client.
    if (!readConsent()) setVisible(true);

    const reopen = () => {
      const current = readConsent();
      setAnalytics(current?.analytics ?? false);
      setMarketing(current?.marketing ?? false);
      setShowDetails(true);
      setVisible(true);
    };
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
  }, []);

  const choose = (choices: ConsentChoices) => {
    saveConsent(choices);
    setVisible(false);
    setShowDetails(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-labelledby="cookie-banner-title">
      <h2 id="cookie-banner-title" className="cookie-banner__title">
        Votre vie privée
      </h2>
      <p className="cookie-banner__text">
        Ce site utilise uniquement les cookies nécessaires à son fonctionnement (réservation,
        paiement). Avec votre accord, nous pourrions aussi utiliser des cookies de mesure d’audience
        et de ciblage. Vous pouvez modifier votre choix à tout moment.{" "}
        <Link href="/politique-de-cookies">En savoir plus</Link>
      </p>

      {showDetails && (
        <div className="cookie-banner__details">
          <label className="cookie-banner__option">
            <input type="checkbox" checked disabled />
            <span>
              <strong>Nécessaires</strong> : fonctionnement du site, réservation et paiement
              (toujours actifs)
            </span>
          </label>
          <label className="cookie-banner__option">
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
            />
            <span>
              <strong>Mesure d’audience</strong> : statistiques de fréquentation
            </span>
          </label>
          <label className="cookie-banner__option">
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
            />
            <span>
              <strong>Ciblage</strong> : publicités et contenus personnalisés
            </span>
          </label>
        </div>
      )}

      <div className="cookie-banner__actions">
        <button
          type="button"
          className="cookie-btn"
          onClick={() => choose({ analytics: false, marketing: false })}
        >
          Tout refuser
        </button>
        {showDetails ? (
          <button
            type="button"
            className="cookie-btn"
            onClick={() => choose({ analytics, marketing })}
          >
            Enregistrer mes choix
          </button>
        ) : (
          <button type="button" className="cookie-btn" onClick={() => setShowDetails(true)}>
            Personnaliser
          </button>
        )}
        <button
          type="button"
          className="cookie-btn cookie-btn--primary"
          onClick={() => choose({ analytics: true, marketing: true })}
        >
          Tout accepter
        </button>
      </div>
    </div>
  );
}
