import { useMutation, useQueryClient } from "@tanstack/react-query";

import { paymentsApi } from "@/features/payments/api/payments.api";
import { paymentsKeys } from "@/features/payments/api/payments.keys";
import type { UpdatePaymentStatusPayload } from "@/types/payment";

/** Admin uniquement — nécessite la session (cookie). */
export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePaymentStatusPayload }) =>
      paymentsApi.updateStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentsKeys.all });
    },
  });
}
