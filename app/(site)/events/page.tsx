import type { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import { EventsExplorer } from "@/components/events/EventsExplorer";
import { eventsKeys } from "@/features/events/api/events.keys";
import { eventsApi } from "@/features/events/api/events.api";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Événements",
  description:
    "Découvrez tous les événements culturels et touristiques proposés par Even Travel : concerts, festivals, excursions, formations et plus.",
  alternates: { canonical: canonicalUrl("/events") },
  openGraph: {
    title: "Événements — Even Travel",
    description: "Vivez des expériences culturelles et touristiques inoubliables.",
  },
};

export default async function EventsPage() {
  // Même logique de prefetch serveur que /destinations — voir ce fichier
  // pour le détail. Clé identique à useEvents() appelé sans paramètres.
  const queryClient = new QueryClient();
  await queryClient
    .prefetchQuery({
      queryKey: eventsKeys.list(),
      queryFn: () => eventsApi.getAll(),
    })
    .catch(() => undefined);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EventsExplorer />
    </HydrationBoundary>
  );
}
