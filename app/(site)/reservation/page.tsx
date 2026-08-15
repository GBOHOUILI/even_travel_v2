import type { Metadata } from "next";
import { Suspense } from "react";

import { ReservationHero } from "@/components/reservation/ReservationHero";
import { ReservationPageClient } from "@/components/reservation/ReservationPageClient";
import { Loader } from "@/components/ui/Loader";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Réservation",
  description: "Réservez votre prochaine aventure Even Travel en quelques clics.",
  // Canonical sur l'URL nue (sans ?type=&id=) : la page est toujours
  // accédée avec des paramètres de requête différents selon le point
  // d'entrée (depuis une destination, un événement...) — indexer une
  // seule URL canonique évite le contenu dupliqué par variation de query string.
  alternates: { canonical: canonicalUrl("/reservation") },
};

export default function ReservationPage() {
  return (
    // useSearchParams() (dans ReservationPageClient) exige une limite
    // Suspense en App Router pour permettre le rendu statique du reste
    // de la page.
    <Suspense
      fallback={
        <>
          <ReservationHero />
          <div className="reservation-container">
            <Loader label="Chargement..." />
          </div>
        </>
      }
    >
      <ReservationPageClient />
    </Suspense>
  );
}
