import type { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import { DestinationsExplorer } from "@/components/destinations/DestinationsExplorer";
import { destinationsKeys } from "@/features/destinations/api/destinations.keys";
import { destinationsApi } from "@/features/destinations/api/destinations.api";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Découvrez toutes les destinations africaines proposées par Even Travel : Bénin, Ghana, Maroc, Togo, Tunisie et plus encore.",
  alternates: { canonical: canonicalUrl("/destinations") },
  openGraph: {
    title: "Destinations — Even Travel",
    description: "Découvrez nos destinations africaines uniques.",
  },
};

export default async function DestinationsPage() {
  // Prefetch serveur : le HTML initial contient déjà les fiches et leurs
  // liens vers /destinations/[id] (au lieu de dépendre d'un fetch client
  // React Query déclenché après hydratation — voir audit SEO section 8/12).
  // Même clé de requête que useDestinations() pour que React Query
  // réutilise le cache hydraté sans reformuler d'appel au montage.
  const queryClient = new QueryClient();
  await queryClient
    .prefetchQuery({
      queryKey: destinationsKeys.list(),
      queryFn: destinationsApi.getAll,
    })
    // Si le backend est indisponible (cold start Render...), on laisse le
    // cache vide plutôt que de faire planter le rendu serveur : le
    // Client Component reprendra la main et retentera côté navigateur
    // (comportement inchangé par rapport à avant ce fix).
    .catch(() => undefined);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DestinationsExplorer />
    </HydrationBoundary>
  );
}
