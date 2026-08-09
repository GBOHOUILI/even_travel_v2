import { useMutation, useQueryClient } from "@tanstack/react-query";

import { reservationsApi } from "@/features/reservations/api/reservations.api";
import { reservationsKeys } from "@/features/reservations/api/reservations.keys";

/** Admin uniquement — nécessite la session (cookie). */
export function useDeleteReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reservationsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationsKeys.all });
    },
  });
}
