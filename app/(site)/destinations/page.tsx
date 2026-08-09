import type { Metadata } from "next";

import { DestinationsExplorer } from "@/components/destinations/DestinationsExplorer";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Découvrez toutes les destinations africaines proposées par Even Travel : Bénin, Ghana, Maroc, Togo, Tunisie et plus encore.",
  openGraph: {
    title: "Destinations — Even Travel",
    description: "Découvrez nos destinations africaines uniques.",
  },
};

export default function DestinationsPage() {
  return <DestinationsExplorer />;
}
