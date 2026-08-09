import { useMutation, useQueryClient } from "@tanstack/react-query";

import { destinationsApi } from "@/features/destinations/api/destinations.api";
import { destinationsKeys } from "@/features/destinations/api/destinations.keys";

export function useDeleteDestination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => destinationsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: destinationsKeys.all });
    },
  });
}
