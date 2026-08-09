import type { Metadata } from "next";
import { Suspense } from "react";

import { ReservationHero } from "@/components/reservation/ReservationHero";
import { ReservationPageClient } from "@/components/reservation/ReservationPageClient";
import { Loader } from "@/components/ui/Loader";

export const metadata: Metadata = {
  title: "Réservation",
  description: "Réservez votre prochaine aventure Even Travel en quelques clics.",
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
