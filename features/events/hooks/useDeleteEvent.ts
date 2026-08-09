import { useMutation, useQueryClient } from "@tanstack/react-query";

import { eventsApi } from "@/features/events/api/events.api";
import { eventsKeys } from "@/features/events/api/events.keys";

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventsKeys.all });
    },
  });
}
