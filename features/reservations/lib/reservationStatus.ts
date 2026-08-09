import type { ReservationStatutPaiement } from "@/types/reservation";

export const RESERVATION_STATUSES: ReservationStatutPaiement[] = [
  "en_attente",
  "acompte",
  "paye",
  "annule",
];

const STATUS_LABELS: Record<ReservationStatutPaiement, string> = {
  en_attente: "En attente",
  acompte: "Acompte",
  paye: "Payé",
  annule: "Annulé",
};

const STATUS_CLASSES: Record<ReservationStatutPaiement, string> = {
  en_attente: "admin-status-pending",
  acompte: "admin-status-approved",
  paye: "admin-status-paid",
  annule: "admin-status-cancelled",
};

export function getReservationStatusLabel(status: ReservationStatutPaiement | undefined): string {
  if (!status) return "—";
  return STATUS_LABELS[status] ?? status;
}

export function getReservationStatusClass(status: ReservationStatutPaiement | undefined): string {
  if (!status) return "admin-status-pending";
  return STATUS_CLASSES[status] ?? "admin-status-pending";
}
