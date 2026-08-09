"use client";

import { useMemo, useState } from "react";

import { ReservationDetailModal } from "@/components/admin/reservations/ReservationDetailModal";
import { ConfirmDeleteModal } from "@/components/admin/shared/ConfirmDeleteModal";
import { useDeleteReservation } from "@/features/reservations/hooks/useDeleteReservation";
import { useReservations } from "@/features/reservations/hooks/useReservations";
import {
  RESERVATION_STATUSES,
  getReservationStatusClass,
  getReservationStatusLabel,
} from "@/features/reservations/lib/reservationStatus";
import { ApiError } from "@/lib/api";
import { exportToCsv } from "@/lib/exportCsv";
import { useToast } from "@/providers/ToastProvider";
import type { ReservationStatutPaiement } from "@/types/reservation";

const ITEMS_PER_PAGE = 10;

export function ReservationsTable() {
  const { data: reservations, isLoading } = useReservations();
  const deleteReservation = useDeleteReservation();
  const { showToast } = useToast();

  const [statusFilter, setStatusFilter] = useState<ReservationStatutPaiement | "all">("all");
  const [page, setPage] = useState(1);
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return (reservations ?? []).filter(
      (r) => statusFilter === "all" || r.statutPaiement === statusFilter,
    );
  }, [reservations, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const confirmDelete = () => {
    if (!pendingDeleteId) return;
    deleteReservation.mutate(pendingDeleteId, {
      onSuccess: () => {
        showToast("Suppression effectuée avec succès !", "success");
        setPendingDeleteId(null);
      },
      onError: (error) => {
        const message =
          error instanceof ApiError ? error.message : "Erreur lors de la suppression.";
        showToast(message, "error");
        setPendingDeleteId(null);
      },
    });
  };

  const handleExport = () => {
    const headers = [
      "Référence",
      "Client",
      "Type",
      "Date",
      "Places",
      "Montant Total",
      "Montant Payé",
      "Statut",
    ];
    const rows = filtered.map((reservation) => [
      reservation._id,
      `${reservation.client?.prenom ?? ""} ${reservation.client?.nom ?? ""}`.trim(),
      reservation.type === "event" ? "Événement" : "Destination",
      reservation.date ? new Date(reservation.date).toLocaleDateString("fr-FR") : "",
      String(reservation.nombrePlaces || 1),
      `${(reservation.montantTotal || 0).toLocaleString("fr-FR")} FCFA`,
      `${(reservation.montantPaye || 0).toLocaleString("fr-FR")} FCFA`,
      getReservationStatusLabel(reservation.statutPaiement),
    ]);
    exportToCsv("reservations.csv", headers, rows);
  };

  return (
    <>
      <div className="admin-section-header">
        <h1 className="admin-section-title">Gestion des Réservations</h1>
      </div>

      <div className="admin-data-table">
        <div className="admin-table-header">
          <h3 className="admin-table-title">Réservations récentes</h3>
          <div className="admin-table-header-actions">
            <div className="admin-filter-options">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as ReservationStatutPaiement | "all");
                  setPage(1);
                }}
              >
                <option value="all">Tous les statuts</option>
                {RESERVATION_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {getReservationStatusLabel(status)}
                  </option>
                ))}
              </select>
            </div>
            <button type="button" className="admin-export-btn" onClick={handleExport}>
              <i className="fas fa-download" aria-hidden="true" /> Exporter CSV
            </button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Référence</th>
              <th>Client</th>
              <th>Type</th>
              <th>Date</th>
              <th>Places</th>
              <th>Montant Total</th>
              <th>Montant Payé</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={9}>Chargement des réservations...</td>
              </tr>
            )}
            {!isLoading && paginated.length === 0 && (
              <tr>
                <td colSpan={9}>Aucune réservation disponible</td>
              </tr>
            )}
            {paginated.map((reservation) => (
              <tr key={reservation._id}>
                <td className="admin-mono-cell">{reservation._id.slice(0, 8)}...</td>
                <td>
                  {reservation.client?.prenom} {reservation.client?.nom}
                </td>
                <td>{reservation.type === "event" ? "Événement" : "Destination"}</td>
                <td>
                  {reservation.date ? new Date(reservation.date).toLocaleDateString("fr-FR") : "N/A"}
                </td>
                <td>{reservation.nombrePlaces || 1}</td>
                <td>{(reservation.montantTotal || 0).toLocaleString("fr-FR")} FCFA</td>
                <td>{(reservation.montantPaye || 0).toLocaleString("fr-FR")} FCFA</td>
                <td>
                  <span className={`admin-status-badge ${getReservationStatusClass(reservation.statutPaiement)}`}>
                    {getReservationStatusLabel(reservation.statutPaiement)}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className="admin-action-btn admin-edit-btn"
                    onClick={() => setSelectedReservationId(reservation._id)}
                  >
                    Détails
                  </button>
                  <button
                    type="button"
                    className="admin-action-btn admin-delete-btn"
                    onClick={() => setPendingDeleteId(reservation._id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="admin-pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                className={`admin-page-btn ${p === currentPage ? "active" : ""}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      <ReservationDetailModal
        reservationId={selectedReservationId}
        onClose={() => setSelectedReservationId(null)}
      />

      <ConfirmDeleteModal
        open={!!pendingDeleteId}
        message="Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible."
        isPending={deleteReservation.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </>
  );
}
