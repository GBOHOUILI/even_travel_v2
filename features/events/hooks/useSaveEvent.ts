import { useMutation, useQueryClient } from "@tanstack/react-query";

import { eventsApi } from "@/features/events/api/events.api";
import { eventsKeys } from "@/features/events/api/events.keys";
import { buildEventFormData } from "@/features/events/lib/eventFormMapper";
import type { EventFormValues } from "@/features/events/lib/eventFormSchema";

export function useSaveEvent(id?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: EventFormValues) => {
      const formData = buildEventFormData(values);
      return id ? eventsApi.update(id, formData) : eventsApi.create(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventsKeys.all });
    },
  });
}
