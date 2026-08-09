import { useMutation, useQueryClient } from "@tanstack/react-query";

import { paymentsApi } from "@/features/payments/api/payments.api";
import { paymentsKeys } from "@/features/payments/api/payments.keys";

/** Admin uniquement — nécessite la session (cookie). */
export function useDeletePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => paymentsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentsKeys.all });
    },
  });
}
