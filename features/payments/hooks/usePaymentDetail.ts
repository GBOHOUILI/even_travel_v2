import { useQuery } from "@tanstack/react-query";

import { paymentsApi } from "@/features/payments/api/payments.api";
import { paymentsKeys } from "@/features/payments/api/payments.keys";

/** Admin uniquement — nécessite la session (cookie). */
export function usePaymentDetail(id: string | null) {
  return useQuery({
    queryKey: paymentsKeys.detail(id ?? ""),
    queryFn: () => paymentsApi.getById(id as string),
    enabled: Boolean(id),
  });
}
