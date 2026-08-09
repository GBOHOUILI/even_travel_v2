import { useQuery } from "@tanstack/react-query";

import { eventsApi, type GetEventsParams } from "@/features/events/api/events.api";
import { eventsKeys } from "@/features/events/api/events.keys";

export function useEvents(params?: GetEventsParams) {
  return useQuery({
    queryKey: eventsKeys.list(params),
    queryFn: () => eventsApi.getAll(params),
  });
}
