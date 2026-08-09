import { useMutation, useQueryClient } from "@tanstack/react-query";

import { destinationsApi } from "@/features/destinations/api/destinations.api";
import { destinationsKeys } from "@/features/destinations/api/destinations.keys";
import { buildDestinationFormData } from "@/features/destinations/lib/destinationFormMapper";
import type { DestinationFormValues } from "@/features/destinations/lib/destinationFormSchema";

export function useSaveDestination(id?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: DestinationFormValues) => {
      const formData = buildDestinationFormData(values);
      return id ? destinationsApi.update(id, formData) : destinationsApi.create(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: destinationsKeys.all });
    },
  });
}
