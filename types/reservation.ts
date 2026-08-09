export type ReservationType = "event" | "destination";
export type PaymentPlan = "unique" | "deux_tranches";
/**
 * Valeurs reconnues par le modèle Payment du backend (methodePaiement).
 * Champ actuellement informatif côté frontend : POST /reservations/initier
 * ne lit pas ce champ (voir README), et confirmPayment déduit lui-même la
 * méthode réelle depuis la réponse Kkiapay. Gardé aligné sur l'enum
 * backend par cohérence / si le champ devient un jour exploité.
 */
export type PaymentMethod = "carte" | "mtn" | "moov" | "autre";
export type ReservationStatutPaiement = "en_attente" | "acompte" | "paye" | "annule";

export interface ReservationClient {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
}

/**
 * Contrat réel de POST /api/v1/reservations/initier, déduit du code
 * source du backend (src/controllers/reservationController.js#initPayment).
 */
export interface InitierReservationPayload {
  client: ReservationClient;
  type: ReservationType;
  itemId: string;
  date: string;
  nombrePlaces: number;
  message?: string;
  planPaiement: PaymentPlan;
  /** Envoyé mais actuellement ignoré par le backend — voir le type ci-dessus. */
  methodePaiement: PaymentMethod;
}

/**
 * Document Reservation complet (mongoose), tel que renvoyé par
 * GET /reservations/:id, POST /payments/verify, etc.
 */
export interface Reservation {
  _id: string;
  type: ReservationType;
  typeModel: "Event" | "Destination";
  itemId: string;
  client: ReservationClient;
  date: string;
  nombrePlaces: number;
  message?: string;
  planPaiement: PaymentPlan;
  montantTotal: number;
  montantPaye: number;
  statutPaiement: ReservationStatutPaiement;
  transactionId?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * POST /reservations/initier ne renvoie PAS le document Reservation
 * complet mais un résumé restreint (voir initPayment côté backend) :
 * pas de `client`, pas de `statutPaiement`, mais `itemName`/`itemLocation`
 * en plus (dénormalisés pour affichage rapide).
 */
export interface InitierReservationSummary {
  _id: string;
  montantTotal: number;
  montantPaye: number;
  planPaiement: PaymentPlan;
  itemName: string;
  itemLocation: string;
  date: string;
  nombrePlaces: number;
}

/**
 * Données renvoyées par POST /reservations/initier pour initialiser le
 * widget Kkiapay côté client (flux "client-side widget", contrairement à
 * l'ancien flux Moneroo "server-to-server" qui renvoyait un checkout_url).
 * ⚠️ La clé de premier niveau est `kkiapay`, PAS `payment`.
 */
export interface KkiapayPaymentInit {
  publicKey: string;
  amount: number;
  sandbox: boolean;
  /** Echo de reservationId renvoyé par le backend — objet, pas une chaîne. */
  data: { reservationId: string };
}

export interface InitierReservationResponse {
  status: string;
  data: {
    reservation: InitierReservationSummary;
    kkiapay: KkiapayPaymentInit;
  };
}

export interface ReservationsResponse {
  status: string;
  data: {
    reservations: Reservation[];
    total?: number;
  };
}

export interface ReservationResponse {
  status: string;
  data: {
    reservation: Reservation;
  };
}

/**
 * Item dénormalisé (event ou destination) tel que renvoyé par le backend
 * en accompagnement d'une réservation dans GET /reservations (admin) —
 * cf. admin-dashboard.html d'origine (`r.itemDetails || r.itemId`).
 */
export interface ReservationItemDetails {
  titre?: string;
  localisation?: string;
  [key: string]: unknown;
}

/**
 * Réservation telle que renvoyée par GET /reservations (admin), avec
 * l'item (event/destination) dénormalisé sous `itemDetails` pour éviter
 * un aller-retour supplémentaire côté liste.
 */
export interface ReservationWithDetails extends Reservation {
  itemDetails?: ReservationItemDetails;
}

export interface ReservationsWithDetailsResponse {
  status: string;
  data: {
    reservations: ReservationWithDetails[];
    total?: number;
  };
}

/**
 * Contrat de PATCH /reservations/:id/status (admin) — cf.
 * changeReservationStatus() dans admin-dashboard.html d'origine.
 */
export interface UpdateReservationStatusPayload {
  statutPaiement: ReservationStatutPaiement;
}

/**
 * Contrat de GET /reservations/stats (admin, cf. admin-dashboard.html).
 * Seul `totalReservations` est exploité par le tableau de bord d'origine
 * — les autres champs sont probables mais non confirmés côté backend.
 */
export interface ReservationsStatsResponse {
  status: string;
  data: {
    stats: {
      totalReservations: number;
      [key: string]: number;
    };
  };
}
