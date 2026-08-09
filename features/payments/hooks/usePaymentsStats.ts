import { useQuery } from "@tanstack/react-query";

import { paymentsApi } from "@/features/payments/api/payments.api";
import { paymentsKeys } from "@/features/payments/api/payments.keys";

/** Admin uniquement — nécessite la session (cookie). */
export function usePaymentsStats() {
  return useQuery({
    queryKey: paymentsKeys.stats(),
    queryFn: paymentsApi.getStats,
  });
}
