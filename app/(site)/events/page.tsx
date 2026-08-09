import type { Metadata } from "next";

import { EventsExplorer } from "@/components/events/EventsExplorer";

export const metadata: Metadata = {
  title: "Événements",
  description:
    "Découvrez tous les événements culturels et touristiques proposés par Even Travel : concerts, festivals, excursions, formations et plus.",
  openGraph: {
    title: "Événements — Even Travel",
    description: "Vivez des expériences culturelles et touristiques inoubliables.",
  },
};

export default function EventsPage() {
  return <EventsExplorer />;
}
