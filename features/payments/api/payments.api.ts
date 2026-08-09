import { apiClient } from "@/lib/api";
import type {
  PaymentsStatsResponse,
  PaymentWithReservation,
  PaymentWithReservationResponse,
  PaymentsWithReservationResponse,
  UpdatePaymentStatusPayload,
  VerifyPaymentPayload,
  VerifyPaymentResponse,
} from "@/types/payment";

export const paymentsApi = {
  /**
   * Après succès du widget Kkiapay côté client, le frontend transmet
   * l'ID de transaction au backend, qui vérifie auprès de Kkiapay
   * (clé privée/secrète côté serveur uniquement) avant de confirmer la
   * réservation. Le frontend ne valide donc jamais un paiement par
   * lui-même.
   */
  verify: async (payload: VerifyPaymentPayload) => {
    const { data } = await apiClient.post<VerifyPaymentResponse>("/payments/verify", payload);
    return data.data;
  },

  /** Admin uniquement — nécessite la session (cookie). */
  getStats: async () => {
    const { data } = await apiClient.get<PaymentsStatsResponse>("/payments/stats", {
      withCredentials: true,
    });
    return data.data.stats;
  },

  /**
   * Admin uniquement — nécessite la session (cookie).
   * Le backend ne pagine pas côté serveur (cf. admin-dashboard.html
   * d'origine, qui pagine côté client) : on récupère tout et on
   * paginate/filtre dans l'UI.
   */
  getAll: async (): Promise<PaymentWithReservation[]> => {
    const { data } = await apiClient.get<PaymentsWithReservationResponse>("/payments", {
      withCredentials: true,
    });
    return data.data.payments;
  },

  /** Admin uniquement — nécessite la session (cookie). */
  getById: async (id: string): Promise<PaymentWithReservation> => {
    const { data } = await apiClient.get<PaymentWithReservationResponse>(`/payments/${id}`, {
      withCredentials: true,
    });
    return data.data.payment;
  },

  /** Admin uniquement — nécessite la session (cookie). */
  updateStatus: async (id: string, payload: UpdatePaymentStatusPayload): Promise<PaymentWithReservation> => {
    const { data } = await apiClient.patch<PaymentWithReservationResponse>(
      `/payments/${id}/status`,
      payload,
      { withCredentials: true },
    );
    return data.data.payment;
  },

  /** Admin uniquement — nécessite la session (cookie). */
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/payments/${id}`, { withCredentials: true });
  },
};
