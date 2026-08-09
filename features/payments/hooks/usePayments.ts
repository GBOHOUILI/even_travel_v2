import { useQuery } from "@tanstack/react-query";

import { paymentsApi } from "@/features/payments/api/payments.api";
import { paymentsKeys } from "@/features/payments/api/payments.keys";

/** Admin uniquement — nécessite la session (cookie). */
export function usePayments() {
  return useQuery({
    queryKey: paymentsKeys.list(),
    queryFn: paymentsApi.getAll,
  });
}
