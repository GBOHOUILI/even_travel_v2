import { apiClient } from "@/lib/api";
import type { Event, EventResponse, EventsResponse } from "@/types/event";

export interface GetEventsParams {
  limit?: number;
  page?: number;
}

export const eventsApi = {
  getAll: async (params?: GetEventsParams): Promise<Event[]> => {
    const { data } = await apiClient.get<EventsResponse>("/events", { params });
    return data.data.events;
  },

  getById: async (id: string): Promise<Event> => {
    const { data } = await apiClient.get<EventResponse>(`/events/${id}`);
    return data.data.event;
  },

  /** Admin uniquement — nécessite la session (cookie). */
  create: async (formData: FormData): Promise<Event> => {
    const { data } = await apiClient.post<EventResponse>("/events", formData, {
      withCredentials: true,
    });
    return data.data.event;
  },

  /** Admin uniquement — nécessite la session (cookie). */
  update: async (id: string, formData: FormData): Promise<Event> => {
    const { data } = await apiClient.patch<EventResponse>(`/events/${id}`, formData, {
      withCredentials: true,
    });
    return data.data.event;
  },

  /** Admin uniquement — nécessite la session (cookie). */
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/events/${id}`, { withCredentials: true });
  },
};
