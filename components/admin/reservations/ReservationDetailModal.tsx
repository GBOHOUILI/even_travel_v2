"use client";

import { useState } from "react";

import { AdminModal } from "@/components/admin/shared/AdminModal";
import { useReservationDetail } from "@/features/reservations/hooks/useReservationDetail";
import { useUpdateReservationStatus } from "@/features/reservations/hooks/useUpdateReservationStatus";
import {
  RESERVATION_STATUSES,
  getReservationStatusClass,
  getReservationStatusLabel,
} from "@/features/reservations/lib/reservationStatus";
import { ApiError } from "@/lib/api";
import { useToast } from "@/providers/ToastProvider";
import type { ReservationStatutPaiement } from "@/types/reservation";

interface ReservationDetailModalProps {
  reservationId: string | null;
  onClose: () => void;
}

export function ReservationDetailModal({ reservationId, onClose }: ReservationDetailModalProps) {
  const { data: reservation, isLoading } = useReservationDetail(reservationId);
  const updateStatus = useUpdateReservationStatus();
  const { showToast } = useToast();
  const [nextStatus, setNextStatus] = useState<ReservationStatutPaiement | "">("");

  const handleClose = () => {
    setNextStatus("");
    onClose();
  };

  const handleUpdateStatus = () => {
    if (!reservationId || !nextStatus) return;
    updateStatus.mutate(
      { id: reservationId, payload: { statutPaiement: nextStatus } },
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

  return (
    <AdminModal
      open={Boolean(reservationId)}
      title={reservation ? `Réservation #${reservation._id.slice(0, 8)}` : "Détails de la Réservation"}
      onClose={handleClose}
    >
      {isLoading && <p>Chargement des données...</p>}

      {!isLoading && reservation && (
        <div className="admin-detail-grid">
          <div className="admin-detail-columns">
            <div>
              <h4>Informations Client</h4>
              <p>
                <strong>Nom :</strong> {reservation.client?.prenom} {reservation.client?.nom}
              </p>
              <p>
                <strong>Email :</strong> {reservation.client?.email || "Non spécifié"}
              </p>
              <p>
                <strong>Téléphone :</strong> {reservation.client?.telephone || "Non spécifié"}
              </p>
            </div>
            <div>
              <h4>Détails Réservation</h4>
              <p>
                <strong>Type :</strong> {reservation.type === "event" ? "Événement" : "Destination"}
              </p>
              <p>
                <strong>Date de création :</strong>{" "}
                {reservation.createdAt
                  ? new Date(reservation.createdAt).toLocaleDateString("fr-FR")
                  : "N/A"}
              </p>
              <p>
                <strong>Nombre de places :</strong> {reservation.nombrePlaces || 1}
              </p>
            </div>
          </div>

          <div className="admin-detail-columns">
            <div>
              <h4>Paiement</h4>
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
                {reservation.planPaiement === "deux_tranches" ? "2 tranches" : "1 tranche"}
              </p>
            </div>
            <div>
              <h4>Statut</h4>
              <span className={`admin-status-badge ${getReservationStatusClass(reservation.statutPaiement)}`}>
                {getReservationStatusLabel(reservation.statutPaiement)}
              </span>
            </div>
          </div>

          {reservation.message && (
            <div>
              <h4>Message du client</h4>
              <p className="admin-detail-message">{reservation.message}</p>
            </div>
          )}

          <div className="admin-detail-status-change">
            <h4>Changer le statut</h4>
            <div className="admin-detail-status-change-row">
              <select
                value={nextStatus}
                onChange={(e) => setNextStatus(e.target.value as ReservationStatutPaiement)}
              >
                <option value="">Sélectionner un statut...</option>
                {RESERVATION_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {getReservationStatusLabel(status)}
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
