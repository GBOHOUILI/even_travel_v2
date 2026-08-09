import { useQuery } from "@tanstack/react-query";

import { authApi } from "@/features/auth/api/auth.api";
import { authKeys } from "@/features/auth/api/auth.keys";

/**
 * `retry: false` : un 401 (pas de session valide) est un résultat normal
 * ici, pas une erreur transitoire réseau — inutile de le retenter.
 */
export function useAdminMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: authApi.me,
    retry: false,
  });
}
