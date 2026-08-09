import { apiClient } from "@/lib/api";
import type {
  InitierReservationPayload,
  InitierReservationResponse,
  Reservation,
  ReservationResponse,
  ReservationsStatsResponse,
  ReservationsWithDetailsResponse,
  ReservationWithDetails,
  UpdateReservationStatusPayload,
} from "@/types/reservation";

export const reservationsApi = {
  initier: async (payload: InitierReservationPayload) => {
    const { data } = await apiClient.post<InitierReservationResponse>("/reservations/initier", payload);
    return data.data;
  },

  /** Admin uniquement — nécessite la session (cookie). */
  getStats: async () => {
    const { data } = await apiClient.get<ReservationsStatsResponse>("/reservations/stats", {
      withCredentials: true,
    });
    return data.data.stats;
  },

  /**
   * Admin uniquement — nécessite la session (cookie).
   * Le backend ne pagine pas côté serveur (cf. admin-dashboard.html
   * d'origine, qui pagine côté client) : on récupère tout et on
   * paginate/filtre dans l'UI, comme pour Destinations/Events.
   */
  getAll: async (): Promise<ReservationWithDetails[]> => {
    const { data } = await apiClient.get<ReservationsWithDetailsResponse>("/reservations", {
      withCredentials: true,
    });
    return data.data.reservations;
  },

  /** Admin uniquement — nécessite la session (cookie). */
  getById: async (id: string): Promise<Reservation> => {
    const { data } = await apiClient.get<ReservationResponse>(`/reservations/${id}`, {
      withCredentials: true,
    });
    return data.data.reservation;
  },

  /** Admin uniquement — nécessite la session (cookie). */
  updateStatus: async (id: string, payload: UpdateReservationStatusPayload): Promise<Reservation> => {
    const { data } = await apiClient.patch<ReservationResponse>(`/reservations/${id}/status`, payload, {
      withCredentials: true,
    });
    return data.data.reservation;
  },

  /** Admin uniquement — nécessite la session (cookie). */
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/reservations/${id}`, { withCredentials: true });
  },
};
