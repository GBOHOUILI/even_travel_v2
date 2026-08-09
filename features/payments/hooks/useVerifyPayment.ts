import { useMutation } from "@tanstack/react-query";

import { paymentsApi } from "@/features/payments/api/payments.api";

export function useVerifyPayment() {
  return useMutation({
    mutationFn: paymentsApi.verify,
  });
}
