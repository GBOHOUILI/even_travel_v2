"use client";

import { useMemo, useState } from "react";

import { PaymentDetailModal } from "@/components/admin/payments/PaymentDetailModal";
import { ConfirmDeleteModal } from "@/components/admin/shared/ConfirmDeleteModal";
import { useDeletePayment } from "@/features/payments/hooks/useDeletePayment";
import { usePayments } from "@/features/payments/hooks/usePayments";
import { usePaymentsStats } from "@/features/payments/hooks/usePaymentsStats";
import { getPaymentMethodLabel } from "@/features/payments/lib/paymentMethod";
import {
  PAYMENT_STATUSES,
  getPaymentStatusClass,
  getPaymentStatusLabel,
} from "@/features/payments/lib/paymentStatus";
import { ApiError } from "@/lib/api";
import { exportToCsv } from "@/lib/exportCsv";
import { useToast } from "@/providers/ToastProvider";
import type { PaymentStatus } from "@/types/payment";

const ITEMS_PER_PAGE = 10;

export function PaymentsTable() {
  const { data: payments, isLoading } = usePayments();
  const { data: stats } = usePaymentsStats();
  const deletePayment = useDeletePayment();
  const { showToast } = useToast();

  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(`${endDate}T23:59:59`) : null;

    return (payments ?? []).filter((p) => {
      const matchesStatus = statusFilter === "all" || p.statut === statusFilter;
      if (!matchesStatus) return false;
      if (!start && !end) return true;
      if (!p.createdAt) return false;
      const created = new Date(p.createdAt);
      return (!start || created >= start) && (!end || created <= end);
    });
  }, [payments, statusFilter, startDate, endDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const confirmDelete = () => {
    if (!pendingDeleteId) return;
    deletePayment.mutate(pendingDeleteId, {
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
    const headers = ["Référence", "Client", "Réservation", "Méthode", "Montant", "Date", "Statut"];
    const rows = filtered.map((payment) => {
      const reservation = payment.reservation;
      const clientNom = reservation?.client?.nom || payment.details?.payerName || "";
      const clientPrenom = reservation?.client?.prenom || "";
      const monerooRef = payment.details?.transactionId || payment._id;
      return [
        monerooRef,
        `${clientPrenom} ${clientNom}`.trim(),
        reservation?._id ?? "",
        getPaymentMethodLabel(payment.methodePaiement),
        payment.montant ? `${payment.montant.toLocaleString("fr-FR")} FCFA` : "0 FCFA",
        payment.createdAt ? new Date(payment.createdAt).toLocaleDateString("fr-FR") : "",
        getPaymentStatusLabel(payment.statut),
      ];
    });
    exportToCsv("paiements.csv", headers, rows);
  };

  return (
    <>
      <div className="admin-section-header">
        <h1 className="admin-section-title">Gestion des Paiements</h1>
      </div>

      <div className="admin-payment-stats-grid">
        <div className="admin-payment-stat-card">
          <div className="admin-payment-stat-icon total">
            <i className="fas fa-receipt" aria-hidden="true" />
          </div>
          <div className="admin-payment-stat-info">
            <p>Total paiements</p>
            <div className="admin-payment-stat-value">{stats?.totalPayments ?? "—"}</div>
          </div>
        </div>
        <div className="admin-payment-stat-card">
          <div className="admin-payment-stat-icon paid">
            <i className="fas fa-check-circle" aria-hidden="true" />
          </div>
          <div className="admin-payment-stat-info">
            <p>Montant encaissé (FCFA)</p>
            <div className="admin-payment-stat-value">
              {stats ? stats.paidAmount.toLocaleString("fr-FR") : "—"}
            </div>
          </div>
        </div>
        <div className="admin-payment-stat-card">
          <div className="admin-payment-stat-icon pending">
            <i className="fas fa-hourglass-half" aria-hidden="true" />
          </div>
          <div className="admin-payment-stat-info">
            <p>En attente (FCFA)</p>
            <div className="admin-payment-stat-value">
              {stats ? stats.pendingAmount.toLocaleString("fr-FR") : "—"}
            </div>
          </div>
        </div>
        <div className="admin-payment-stat-card">
          <div className="admin-payment-stat-icon cancelled">
            <i className="fas fa-times-circle" aria-hidden="true" />
          </div>
          <div className="admin-payment-stat-info">
            <p>Annulés (FCFA)</p>
            <div className="admin-payment-stat-value">
              {stats ? stats.cancelledAmount.toLocaleString("fr-FR") : "—"}
            </div>
          </div>
        </div>
      </div>

      <div className="admin-data-table">
        <div className="admin-table-header">
          <h3 className="admin-table-title">Historique des transactions</h3>
          <div className="admin-table-header-actions">
            <div className="admin-filter-options">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as PaymentStatus | "all");
                  setPage(1);
                }}
              >
                <option value="all">Tous les statuts</option>
                {PAYMENT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {getPaymentStatusLabel(status)}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-date-filter">
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
              />
              <span>au</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <button type="button" className="admin-export-btn" onClick={handleExport}>
              <i className="fas fa-download" aria-hidden="true" /> Exporter CSV
            </button>
          </div>
        </div>
        <div className="admin-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Référence Moneroo</th>
                <th>Client</th>
                <th>Réservation</th>
                <th>Méthode</th>
                <th>Montant</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={8}>Chargement des paiements...</td>
                </tr>
              )}
              {!isLoading && paginated.length === 0 && (
                <tr>
                  <td colSpan={8}>Aucun paiement disponible</td>
                </tr>
              )}
              {paginated.map((payment) => {
                const reservation = payment.reservation;
                const clientNom = reservation?.client?.nom || payment.details?.payerName || "—";
                const clientPrenom = reservation?.client?.prenom || "";
                const reservationRef = reservation?._id ? `${reservation._id.slice(0, 8)}...` : "—";
                const monerooRef =
                  payment.details?.transactionId || `${payment._id.slice(0, 12)}...`;

                return (
                  <tr key={payment._id}>
                    <td className="admin-mono-cell">{monerooRef}</td>
                    <td>
                      {clientPrenom} {clientNom}
                    </td>
                    <td className="admin-mono-cell">{reservationRef}</td>
                    <td>{getPaymentMethodLabel(payment.methodePaiement)}</td>
                    <td>
                      {payment.montant
                        ? `${payment.montant.toLocaleString("fr-FR")} FCFA`
                        : "0 FCFA"}
                    </td>
                    <td>
                      {payment.createdAt
                        ? new Date(payment.createdAt).toLocaleDateString("fr-FR")
                        : "—"}
                    </td>
                    <td>
                      <span
                        className={`admin-status-badge ${getPaymentStatusClass(payment.statut)}`}
                      >
                        {getPaymentStatusLabel(payment.statut)}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-action-btn admin-edit-btn"
                        onClick={() => setSelectedPaymentId(payment._id)}
                      >
                        Détails
                      </button>
                      <button
                        type="button"
                        className="admin-action-btn admin-delete-btn"
                        onClick={() => setPendingDeleteId(payment._id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

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

      <PaymentDetailModal
        paymentId={selectedPaymentId}
        onClose={() => setSelectedPaymentId(null)}
      />

      <ConfirmDeleteModal
        open={!!pendingDeleteId}
        message="Êtes-vous sûr de vouloir supprimer ce paiement ? Cette action est irréversible."
        isPending={deletePayment.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </>
  );
}
