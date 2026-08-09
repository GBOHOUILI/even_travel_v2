import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authApi } from "@/features/auth/api/auth.api";
import { authKeys } from "@/features/auth/api/auth.keys";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.updateMe,
    onSuccess: (admin) => {
      queryClient.setQueryData(authKeys.me(), admin);
    },
  });
}
