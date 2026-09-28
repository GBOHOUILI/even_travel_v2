import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";
import { CONTACT_INFO, LEGAL_INFO, SITE_URL } from "@/constants/config";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site Even Travel : éditeur, hébergement et contact.",
};

export default function MentionsLegalesPage() {
  return (
    <LegalPage title="Mentions légales" updatedAt={LEGAL_INFO.updatedAt}>
      <h2>Éditeur du site</h2>
      <p>
        Le site {SITE_URL} est édité par <strong>{LEGAL_INFO.companyName}</strong>, entreprise
        individuelle exploitée par {LEGAL_INFO.owner}.
      </p>
      <ul>
        <li>Activité : {LEGAL_INFO.activity}</li>
        <li>
          Immatriculation : RCCM Cotonou n° {LEGAL_INFO.rccm} (immatriculée le{" "}
          {LEGAL_INFO.registrationDate})
        </li>
        <li>Adresse : {LEGAL_INFO.address}</li>
        <li>E-mail : {CONTACT_INFO.email}</li>
        <li>Téléphone : {CONTACT_INFO.phone}</li>
      </ul>

      <h2>Responsable de la publication</h2>
      <p>{LEGAL_INFO.publicationManager}</p>

      <h2>Hébergement</h2>
      <ul>
        <li>Site web : {LEGAL_INFO.frontHost}</li>
        <li>Serveur applicatif (API) : {LEGAL_INFO.apiHost}</li>
      </ul>

      <h2>Conception et développement</h2>
      <p>
        Site conçu et développé par{" "}
        <a href="https://www.zerotoone.bj/" target="_blank" rel="noopener noreferrer">
          Zero To One
        </a>
        , Cotonou (Bénin).
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L’ensemble des contenus du site (textes, photographies, logos, graphismes) est protégé par
        le droit de la propriété intellectuelle. Toute reproduction ou réutilisation sans
        autorisation écrite préalable de {LEGAL_INFO.companyName} est interdite.
      </p>

      <h2>Responsabilité</h2>
      <p>
        {LEGAL_INFO.companyName} s’efforce de fournir des informations exactes et à jour, mais ne
        peut garantir l’absence d’erreur ou d’omission. Les liens vers des sites tiers (réseaux
        sociaux, prestataires de paiement) sont proposés à titre informatif ;{" "}
        {LEGAL_INFO.companyName} n’est pas responsable de leur contenu.
      </p>

      <h2>Données personnelles et cookies</h2>
      <p>
        Le traitement de vos données est décrit dans notre{" "}
        <a href="/politique-de-confidentialite">politique de confidentialité</a> et notre{" "}
        <a href="/politique-de-cookies">politique de cookies</a>.
      </p>

      <h2>Droit applicable</h2>
      <p>
        Le présent site est soumis au droit béninois. En cas de litige, et à défaut de résolution
        amiable, les tribunaux de Cotonou sont seuls compétents.
      </p>
    </LegalPage>
  );
}
