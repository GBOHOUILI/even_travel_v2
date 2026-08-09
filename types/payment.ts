/**
 * Aligné sur src/models/Payment.js du backend (enum anglais, pas français).
 */
export type PaymentStatus = "pending" | "paid" | "failed" | "cancelled" | "refunded";
export type PaymentMethodUsed = "carte" | "mtn" | "moov" | "autre";

export interface Payment {
  _id: string;
  reservation: string;
  reference: string;
  kkiapayTransactionId?: string;
  montant: number;
  methodePaiement: PaymentMethodUsed;
  statut: PaymentStatus;
  details?: {
    transactionId?: string;
    payerEmail?: string;
    payerName?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Sous-ensemble de la réservation liée, tel que peuplé (populate mongoose)
 * par GET /payments et GET /payments/:id admin — cf. viewPaymentDetail()
 * dans admin-dashboard.html d'origine (`payment.reservation.client`, etc.).
 */
export interface PaymentReservationSummary {
  _id: string;
  type?: "event" | "destination";
  client?: {
    nom?: string;
    prenom?: string;
    email?: string;
    telephone?: string;
  };
  montantTotal?: number;
  montantPaye?: number;
  planPaiement?: "unique" | "deux_tranches";
  statutPaiement?: "en_attente" | "acompte" | "paye" | "annule";
}

/**
 * Paiement tel que renvoyé par GET /payments et GET /payments/:id (admin),
 * avec la réservation liée peuplée (au lieu du simple ObjectId de `Payment`).
 * `methodePaiement` est élargi car le backend renvoie en pratique plus de
 * valeurs que l'enum modélisé côté front (mtn_bj, moov_bj, card_xof, paypal…).
 */
export interface PaymentWithReservation extends Omit<Payment, "reservation" | "methodePaiement"> {
  reservation?: PaymentReservationSummary;
  methodePaiement: string;
}

export interface PaymentsWithReservationResponse {
  status: string;
  data: {
    payments: PaymentWithReservation[];
    total?: number;
  };
}

export interface PaymentWithReservationResponse {
  status: string;
  data: {
    payment: PaymentWithReservation;
  };
}

/**
 * Contrat de PATCH /payments/:id/status (admin) — cf.
 * promptChangePaymentStatus() dans admin-dashboard.html d'origine.
 */
export interface UpdatePaymentStatusPayload {
  statut: PaymentStatus;
}

export interface PaymentsStatsResponse {
  status: string;
  data: {
    stats: {
      totalPayments: number;
      totalAmount: number;
      pendingAmount: number;
      paidAmount: number;
      cancelledAmount: number;
    };
  };
}

export interface PaymentsResponse {
  status: string;
  data: {
    payments: Payment[];
    total?: number;
  };
}

export interface PaymentResponse {
  status: string;
  data: {
    payment: Payment;
  };
}

/**
 * Contrat de POST /api/v1/payments/verify (src/controllers/paiementController.js#confirmPayment).
 * Le backend revérifie tout auprès de Kkiapay (clé privée/secrète, jamais
 * exposées côté client) avant de créditer la réservation.
 *
 * Erreurs possibles (AppError avec `code` — voir lib/api.ts) :
 * - "payment_failed" (400) : le paiement n'a pas abouti chez Kkiapay
 * - "already_paid" (400) : la réservation est déjà intégralement payée
 * - "amount_mismatch" (400) : le montant débité ne correspond pas au montant attendu
 */
export interface VerifyPaymentPayload {
  transactionId: string;
  reservationId: string;
}

export interface VerifyPaymentResponse {
  status: string;
  data: {
    payment: Payment;
    reservation: {
      _id: string;
      montantPaye: number;
      montantTotal: number;
      statutPaiement: string;
    };
  };
}
