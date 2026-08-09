import { useQuery } from "@tanstack/react-query";

import { reservationsApi } from "@/features/reservations/api/reservations.api";
import { reservationsKeys } from "@/features/reservations/api/reservations.keys";

/** Admin uniquement — nécessite la session (cookie). */
export function useReservations() {
  return useQuery({
    queryKey: reservationsKeys.list(),
    queryFn: reservationsApi.getAll,
  });
}
