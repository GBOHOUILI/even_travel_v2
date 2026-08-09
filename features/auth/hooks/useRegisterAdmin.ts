import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authApi } from "@/features/auth/api/auth.api";
import { authKeys } from "@/features/auth/api/auth.keys";

/**
 * Crée un nouveau compte admin.
 *
 * ⚠️ Bug backend connu : `registerAdmin` appelle `createSendToken`, qui
 * pose le cookie `jwt` pour le compte NOUVELLEMENT créé — ça écrase donc
 * la session de l'admin courant dans le navigateur. En attendant un
 * correctif backend, on invalide le cache de session ici pour que
 * l'interface reflète honnêtement quel compte est réellement actif
 * plutôt que d'afficher des informations obsolètes.
 */
export function useRegisterAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
}
