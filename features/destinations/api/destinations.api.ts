import { apiClient } from "@/lib/api";
import type { Destination, DestinationResponse, DestinationsResponse } from "@/types/destination";

export const destinationsApi = {
  getAll: async (): Promise<Destination[]> => {
    const { data } = await apiClient.get<DestinationsResponse>("/destinations");
    return data.data.destinations;
  },

  getById: async (id: string): Promise<Destination> => {
    const { data } = await apiClient.get<DestinationResponse>(`/destinations/${id}`);
    return data.data.destination;
  },

  /** Admin uniquement — nécessite la session (cookie). */
  create: async (formData: FormData): Promise<Destination> => {
    const { data } = await apiClient.post<DestinationResponse>("/destinations", formData, {
      withCredentials: true,
    });
    return data.data.destination;
  },

  /** Admin uniquement — nécessite la session (cookie). */
  update: async (id: string, formData: FormData): Promise<Destination> => {
    const { data } = await apiClient.patch<DestinationResponse>(`/destinations/${id}`, formData, {
      withCredentials: true,
    });
    return data.data.destination;
  },

  /** Admin uniquement — nécessite la session (cookie). */
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/destinations/${id}`, { withCredentials: true });
  },
};
