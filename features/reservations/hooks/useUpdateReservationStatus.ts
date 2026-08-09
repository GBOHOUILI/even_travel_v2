import { useMutation, useQueryClient } from "@tanstack/react-query";

import { reservationsApi } from "@/features/reservations/api/reservations.api";
import { reservationsKeys } from "@/features/reservations/api/reservations.keys";
import type { UpdateReservationStatusPayload } from "@/types/reservation";

/** Admin uniquement — nécessite la session (cookie). */
export function useUpdateReservationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateReservationStatusPayload }) =>
      reservationsApi.updateStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationsKeys.all });
    },
  });
}
