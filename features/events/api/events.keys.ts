import type { GetEventsParams } from "@/features/events/api/events.api";

export const eventsKeys = {
  all: ["events"] as const,
  list: (params?: GetEventsParams) => [...eventsKeys.all, "list", params ?? {}] as const,
  detail: (id: string) => [...eventsKeys.all, "detail", id] as const,
};
