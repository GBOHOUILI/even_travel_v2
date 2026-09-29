export type ReservationStatus = "en_attente" | "acompte" | "paye" | "annule";

export interface DashboardDailyPoint {
  /** Format YYYY-MM-DD, jour calendaire en heure du Bénin */
  date: string;
  revenue: number;
  reservations: number;
}

export interface DashboardTopItem {
  itemId: string;
  title: string;
  count: number;
  revenue: number;
}

export interface DashboardPaymentMethod {
  method: string;
  count: number;
  amount: number;
}

export interface DashboardRecentReservation {
  id: string;
  client: string;
  type: "event" | "destination";
  title: string;
  places: number;
  montantTotal: number;
  montantPaye: number;
  statutPaiement: ReservationStatus;
  createdAt: string;
}

export interface DashboardStats {
  days: number;
  totals: {
    revenue: number;
    reservations: number;
    pendingComments: number;
    upcomingEvents: number;
  };
  /** Période précédente de même durée, pour calculer l'évolution */
  previous: {
    revenue: number;
    reservations: number;
  };
  daily: DashboardDailyPoint[];
  reservationsByStatus: { status: ReservationStatus; count: number }[];
  paymentsByMethod: DashboardPaymentMethod[];
  topDestinations: DashboardTopItem[];
  topEvents: DashboardTopItem[];
  recentReservations: DashboardRecentReservation[];
}

export interface DashboardResponse {
  status: string;
  data: DashboardStats;
}
