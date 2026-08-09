import { useQuery } from "@tanstack/react-query";

import { eventsApi } from "@/features/events/api/events.api";
import { eventsKeys } from "@/features/events/api/events.keys";

export function useEvent(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: eventsKeys.detail(id),
    queryFn: () => eventsApi.getById(id),
    enabled: Boolean(id) && (options?.enabled ?? true),
  });
}
