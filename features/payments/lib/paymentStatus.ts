import type { PaymentStatus } from "@/types/payment";

export const PAYMENT_STATUSES: PaymentStatus[] = ["paid", "pending", "cancelled", "failed"];

const STATUS_LABELS: Partial<Record<PaymentStatus, string>> = {
  paid: "Payé",
  pending: "En attente",
  cancelled: "Annulé",
  failed: "Échoué",
};

const STATUS_CLASSES: Partial<Record<PaymentStatus, string>> = {
  paid: "admin-status-paid",
  pending: "admin-status-pending",
  cancelled: "admin-status-cancelled",
  failed: "admin-status-failed",
};

export function getPaymentStatusLabel(status: string | undefined): string {
  if (!status) return "—";
  return STATUS_LABELS[status as PaymentStatus] ?? status;
}

export function getPaymentStatusClass(status: string | undefined): string {
  if (!status) return "admin-status-pending";
  return STATUS_CLASSES[status as PaymentStatus] ?? "admin-status-pending";
}
