"use client";

import { useState } from "react";

import { AdminModal } from "@/components/admin/shared/AdminModal";
import { usePaymentDetail } from "@/features/payments/hooks/usePaymentDetail";
import { useUpdatePaymentStatus } from "@/features/payments/hooks/useUpdatePaymentStatus";
import { getPaymentMethodLabel } from "@/features/payments/lib/paymentMethod";
import { PAYMENT_STATUSES, getPaymentStatusClass, getPaymentStatusLabel } from "@/features/payments/lib/paymentStatus";
import {
  getReservationStatusClass,
  getReservationStatusLabel,
} from "@/features/reservations/lib/reservationStatus";
import { ApiError } from "@/lib/api";
import { useToast } from "@/providers/ToastProvider";
import type { PaymentStatus } from "@/types/payment";

interface PaymentDetailModalProps {
  paymentId: string | null;
  onClose: () => void;
}

export function PaymentDetailModal({ paymentId, onClose }: PaymentDetailModalProps) {
  const { data: payment, isLoading } = usePaymentDetail(paymentId);
  const updateStatus = useUpdatePaymentStatus();
  const { showToast } = useToast();
  const [nextStatus, setNextStatus] = useState<PaymentStatus | "">("");

  const handleClose = () => {
    setNextStatus("");
    onClose();
  };

  const handleUpdateStatus = () => {
    if (!paymentId || !nextStatus) return;
    updateStatus.mutate(
      { id: paymentId, payload: { statut: nextStatus } },
      {
        onSuccess: () => {
          showToast("Statut mis à jour avec succès !", "success");
          setNextStatus("");
        },
        onError: (error) => {
          const message =
            error instanceof ApiError ? error.message : "Erreur lors du changement de statut.";
          showToast(message, "error");
        },
      },
    );
  };

  const reservation = payment?.reservation;
  const clientNom = reservation?.client?.nom || payment?.details?.payerName || "—";
  const clientPrenom = reservation?.client?.prenom || "";
  const clientEmail = reservation?.client?.email || payment?.details?.payerEmail || "—";

  return (
    <AdminModal
      open={Boolean(paymentId)}
      title={
        payment
          ? `Paiement — ${(payment.details?.transactionId || payment._id).slice(0, 16)}`
          : "Détails du Paiement"
      }
      onClose={handleClose}
    >
      {isLoading && <p>Chargement des données...</p>}

      {!isLoading && payment && (
        <div className="admin-detail-grid">
          <div className="admin-detail-columns">
            <div>
              <h4>Client</h4>
              <p>
                <strong>Nom :</strong> {clientPrenom} {clientNom}
              </p>
              <p>
                <strong>Email :</strong> {clientEmail}
              </p>
              <p>
                <strong>Téléphone :</strong> {reservation?.client?.telephone || "—"}
              </p>
            </div>
            <div>
              <h4>Transaction</h4>
              <p>
                <strong>ID Moneroo :</strong>{" "}
                <span className="admin-mono-cell">{payment.details?.transactionId || "—"}</span>
              </p>
              <p>
                <strong>Méthode :</strong> {getPaymentMethodLabel(payment.methodePaiement)}
              </p>
              <p>
                <strong>Date :</strong>{" "}
                {payment.createdAt
                  ? new Date(payment.createdAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </p>
            </div>
          </div>

          <div className="admin-detail-columns">
            <div>
              <h4>Montant</h4>
              <p className="admin-detail-amount">
                {payment.montant ? payment.montant.toLocaleString("fr-FR") : 0} FCFA
              </p>
            </div>
            <div>
              <h4>Statut</h4>
              <span className={`admin-status-badge ${getPaymentStatusClass(payment.statut)}`}>
                {getPaymentStatusLabel(payment.statut)}
              </span>
            </div>
          </div>

          {reservation && (
            <div className="admin-detail-message">
              <h4>Réservation liée</h4>
              <div className="admin-detail-columns">
                <p>
                  <strong>ID Réservation :</strong>{" "}
                  <span className="admin-mono-cell">{reservation._id || "—"}</span>
                </p>
                <p>
                  <strong>Type :</strong>{" "}
                  {reservation.type === "event" ? "Événement" : "Destination"}
                </p>
                <p>
                  <strong>Montant total :</strong>{" "}
                  {(reservation.montantTotal || 0).toLocaleString("fr-FR")} FCFA
                </p>
                <p>
                  <strong>Montant payé :</strong>{" "}
                  {(reservation.montantPaye || 0).toLocaleString("fr-FR")} FCFA
                </p>
                <p>
                  <strong>Plan :</strong>{" "}
                  {reservation.planPaiement === "deux_tranches" ? "2 tranches" : "Paiement unique"}
                </p>
                <p>
                  <strong>Statut réservation :</strong>{" "}
                  <span className={`admin-status-badge ${getReservationStatusClass(reservation.statutPaiement)}`}>
                    {getReservationStatusLabel(reservation.statutPaiement)}
                  </span>
                </p>
              </div>
            </div>
          )}

          <div className="admin-detail-status-change">
            <h4>Changer le statut</h4>
            <div className="admin-detail-status-change-row">
              <select value={nextStatus} onChange={(e) => setNextStatus(e.target.value as PaymentStatus)}>
                <option value="">Sélectionner un statut...</option>
                {PAYMENT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {getPaymentStatusLabel(status)}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="admin-save-btn"
                disabled={!nextStatus || updateStatus.isPending}
                onClick={handleUpdateStatus}
              >
                {updateStatus.isPending ? "Mise à jour..." : "Mettre à jour"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminModal>
  );
}
