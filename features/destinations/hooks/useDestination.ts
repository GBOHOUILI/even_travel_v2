import { useQuery } from "@tanstack/react-query";

import { destinationsApi } from "@/features/destinations/api/destinations.api";
import { destinationsKeys } from "@/features/destinations/api/destinations.keys";

export function useDestination(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: destinationsKeys.detail(id),
    queryFn: () => destinationsApi.getById(id),
    enabled: Boolean(id) && (options?.enabled ?? true),
  });
}
