import { useQuery } from "@tanstack/react-query";

import { reservationsApi } from "@/features/reservations/api/reservations.api";
import { reservationsKeys } from "@/features/reservations/api/reservations.keys";

/** Admin uniquement — nécessite la session (cookie). */
export function useReservationDetail(id: string | null) {
  return useQuery({
    queryKey: reservationsKeys.detail(id ?? ""),
    queryFn: () => reservationsApi.getById(id as string),
    enabled: Boolean(id),
  });
}
