import { useQuery } from "@tanstack/react-query";

import { destinationsApi } from "@/features/destinations/api/destinations.api";
import { destinationsKeys } from "@/features/destinations/api/destinations.keys";

export function useDestinations() {
  return useQuery({
    queryKey: destinationsKeys.list(),
    queryFn: destinationsApi.getAll,
  });
}
