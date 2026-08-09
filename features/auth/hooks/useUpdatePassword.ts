import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authApi } from "@/features/auth/api/auth.api";
import { authKeys } from "@/features/auth/api/auth.keys";

/** Le backend fait tourner le token (donc le cookie `jwt`) à chaque
 * changement de mot de passe — rien à gérer côté client au-delà de
 * rafraîchir le cache de l'admin courant. */
export function useUpdatePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.updatePassword,
    onSuccess: (admin) => {
      queryClient.setQueryData(authKeys.me(), admin);
    },
  });
}
