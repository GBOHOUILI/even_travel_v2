import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";
import { CONTACT_INFO, LEGAL_INFO } from "@/constants/config";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Comment Even Travel collecte, utilise et protège vos données personnelles.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalPage title="Politique de confidentialité" updatedAt={LEGAL_INFO.updatedAt}>
      <p>
        Cette politique explique comment {LEGAL_INFO.companyName} collecte et utilise vos données
        personnelles lorsque vous utilisez ce site, conformément à la réglementation applicable au
        Bénin en matière de protection des données personnelles (Code du numérique).
      </p>

      <h2>1. Responsable du traitement</h2>
      <p>
        {LEGAL_INFO.companyName}, {LEGAL_INFO.address}. Contact :{" "}
        <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>.
      </p>

      <h2>2. Données collectées et finalités</h2>
      <ul>
        <li>
          <strong>Formulaire de contact</strong> : les informations que vous saisissez (nom,
          coordonnées, message), utilisées uniquement pour répondre à votre demande.
        </li>
        <li>
          <strong>Réservation et paiement</strong> : vos informations d’identité et de contact, les
          détails de votre réservation et l’état de votre paiement, utilisés pour traiter et suivre
          votre réservation.
        </li>
        <li>
          <strong>Commentaires du blog</strong> : les informations saisies dans le formulaire de
          commentaire, utilisées pour l’affichage et la modération des commentaires.
        </li>
      </ul>

      <h2>3. Base légale</h2>
      <p>
        Vos données sont traitées pour l’exécution de votre demande ou de votre réservation (mesures
        précontractuelles et contrat), sur la base de votre consentement lorsque vous cochez la case
        prévue sous nos formulaires, et pour respecter nos obligations légales (notamment
        comptables).
      </p>

      <h2>4. Destinataires</h2>
      <p>Vos données ne sont jamais vendues. Elles peuvent être traitées par nos prestataires :</p>
      <ul>
        <li>
          Kkiapay : traitement du paiement (les données de paiement sont saisies auprès de Kkiapay)
          ;
        </li>
        <li>Brevo : envoi des e-mails ;</li>
        <li>Cloudinary : hébergement des images du site ;</li>
        <li>nos hébergeurs techniques ;</li>
        <li>Zero To One : maintenance technique du site.</li>
      </ul>
      <p>
        Certains de ces prestataires peuvent être situés hors du Bénin. Nous veillons à ce qu’ils
        présentent des garanties appropriées de protection de vos données.
      </p>

      <h2>5. Durée de conservation</h2>
      <ul>
        <li>Demandes de contact : 3 ans maximum après le dernier échange.</li>
        <li>
          Réservations et paiements : le temps de la relation commerciale, puis pendant la durée
          légale de conservation des pièces comptables.
        </li>
        <li>Commentaires : jusqu’à leur suppression ou votre demande d’effacement.</li>
      </ul>

      <h2>6. Vos droits</h2>
      <p>
        Vous disposez d’un droit d’accès, de rectification, d’effacement, d’opposition, de
        limitation et de portabilité de vos données, ainsi que du droit de retirer votre
        consentement à tout moment. Pour les exercer, écrivez à{" "}
        <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>. Vous pouvez aussi saisir
        l’Autorité de protection des données personnelles (APDP) du Bénin.
      </p>

      <h2>7. Sécurité</h2>
      <p>
        Nous mettons en œuvre des mesures techniques et organisationnelles raisonnables (connexion
        sécurisée HTTPS, accès restreint aux données) pour protéger vos données.
      </p>

      <h2>8. Cookies</h2>
      <p>
        L’usage des cookies est détaillé dans notre{" "}
        <a href="/politique-de-cookies">politique de cookies</a>.
      </p>

      <h2>9. Modification de cette politique</h2>
      <p>
        Cette politique peut évoluer. La date de dernière mise à jour figure en haut de la page.
      </p>
    </LegalPage>
  );
}
