import { useMutation } from "@tanstack/react-query";

import { reservationsApi } from "@/features/reservations/api/reservations.api";

export function useInitierReservation() {
  return useMutation({
    mutationFn: reservationsApi.initier,
  });
}
