"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

/**
 * Avec Kkiapay, contrairement à Moneroo, il n'y a plus de redirection
 * externe : le widget s'ouvre par-dessus la page /reservation, et c'est
 * NOUS (ReservationForm) qui redirigeons vers /paiement une fois la
 * vérification serveur terminée, avec nos propres paramètres
 * `reservationId` et `status` — pas des paramètres imposés par un
 * prestataire externe.
 */
export function PaymentStatus() {
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("reservationId");
  const status = searchParams.get("status");

  if (status === "already_paid") {
    return (
      <div className="payment-status-success">
        <h2>
          <i className="fas fa-check-circle" aria-hidden="true" /> Réservation déjà payée
        </h2>
        <p>
          Votre réservation <strong>(ID : {reservationId || "—"})</strong> est déjà entièrement réglée.
        </p>
        <p>Vous allez recevoir les détails et la confirmation par email sous peu.</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="payment-status-success">
        <h2>
          <i className="fas fa-check-circle" aria-hidden="true" /> Paiement réussi !
        </h2>
        <p>
          Réservation confirmée <strong>(ID : {reservationId || "—"})</strong>
        </p>
        <p>Merci pour votre confiance ! Vous recevrez les détails par email très bientôt.</p>
      </div>
    );
  }

  return (
    <div className="payment-status-info">
      <h2>
        <i className="fas fa-info-circle" aria-hidden="true" /> Statut de paiement non reconnu
      </h2>
      <p>Cette page s&apos;affiche normalement uniquement après une redirection depuis la réservation.</p>
      <p style={{ marginTop: 25 }}>
        <Link href="/reservation" className="payment-btn">
          Faire une réservation
        </Link>
      </p>
    </div>
  );
}
