import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { PaymentStatus } from "@/components/paiement/PaymentStatus";
import { Loader } from "@/components/ui/Loader";

export const metadata: Metadata = {
  title: "Paiement",
  description: "Statut du paiement de votre réservation Even Travel.",
  robots: { index: false, follow: false },
};

export default function PaiementPage() {
  return (
    <div className="payment-page">
      <div className="payment-card">
        <h1>Paiement de votre réservation</h1>

        <Suspense fallback={<Loader label="Vérification du statut..." />}>
          <PaymentStatus />
        </Suspense>

        <Link href="/" className="payment-btn">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
