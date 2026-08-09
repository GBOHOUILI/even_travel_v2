import { commentsApi } from "@/features/comments/api/comments.api";
import { destinationsApi } from "@/features/destinations/api/destinations.api";
import { eventsApi } from "@/features/events/api/events.api";
import { paymentsApi } from "@/features/payments/api/payments.api";
import { reservationsApi } from "@/features/reservations/api/reservations.api";
import type { DashboardStats } from "@/features/dashboard/api/dashboard.types";

/**
 * `Promise.allSettled` plutôt que `Promise.all` : reproduit le comportement
 * de admin-dashboard.html où chaque bloc stat avait son propre try/catch
 * (ex: "Stats réservations non disponibles" n'empêchait pas le reste de
 * s'afficher).
 */
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const [reservations, events, destinations, comments, payments] = await Promise.allSettled([
      reservationsApi.getStats(),
      eventsApi.getAll(),
      destinationsApi.getAll(),
      commentsApi.getAll(),
      paymentsApi.getStats(),
    ]);

    return {
      totalReservations:
        reservations.status === "fulfilled" ? reservations.value.totalReservations : null,
      totalEvents:
        events.status === "fulfilled" ? events.value.filter((e) => e.featured).length : null,
      totalDestinations: destinations.status === "fulfilled" ? destinations.value.length : null,
      totalComments: comments.status === "fulfilled" ? comments.value.length : null,
      totalRevenue: payments.status === "fulfilled" ? payments.value.paidAmount : null,
    };
  },
};
