import type { Metadata } from "next";

import { CookieSettingsButton } from "@/components/consent/CookieSettingsButton";
import { LegalPage } from "@/components/legal/LegalPage";
import { LEGAL_INFO } from "@/constants/config";

export const metadata: Metadata = {
  title: "Politique de cookies",
  description: "Les cookies et traceurs utilisés sur le site Even Travel et comment les gérer.",
};

export default function PolitiqueCookiesPage() {
  return (
    <LegalPage title="Politique de cookies" updatedAt={LEGAL_INFO.updatedAt}>
      <p>
        Un cookie (ou traceur) est une petite information enregistrée sur votre appareil lorsque
        vous visitez un site. Voici ceux que nous utilisons.
      </p>

      <h2>Cookies strictement nécessaires (sans consentement)</h2>
      <p>Indispensables au fonctionnement du site, ils ne peuvent pas être désactivés :</p>
      <ul>
        <li>mémorisation technique de votre réservation en cours ;</li>
        <li>module de paiement Kkiapay, nécessaire pour régler une réservation ;</li>
        <li>session de connexion de l’espace d’administration (réservé à l’équipe) ;</li>
        <li>mémorisation de votre choix concernant les cookies.</li>
      </ul>

      <h2>Mesure d’audience (uniquement avec votre accord)</h2>
      <p>
        Ils nous permettent de comprendre comment le site est utilisé afin de l’améliorer. Ils ne
        sont déposés qu’après votre consentement.
      </p>

      <h2>Ciblage (uniquement avec votre accord)</h2>
      <p>
        Ils permettraient d’afficher des contenus ou publicités adaptés à vos centres d’intérêt. Ils
        ne sont déposés qu’après votre consentement.
      </p>

      <h2>Gérer vos choix</h2>
      <p>
        Vous pouvez accepter, refuser ou modifier vos choix à tout moment. Refuser les cookies de
        mesure d’audience et de ciblage n’a aucun impact sur l’utilisation du site.
      </p>
      <p>
        <CookieSettingsButton className="cookie-btn cookie-btn--primary">
          Modifier mes préférences
        </CookieSettingsButton>
      </p>
    </LegalPage>
  );
}
