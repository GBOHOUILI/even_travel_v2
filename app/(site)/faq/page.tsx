import type { Metadata } from "next";
import Link from "next/link";

import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Toutes les réponses à vos questions sur Even Travel : destinations, paiement en plusieurs fois, moyens de paiement acceptés et expériences sur mesure.",
  openGraph: {
    title: "FAQ — Even Travel",
    description: "Questions fréquentes sur les voyages, réservations et paiements Even Travel.",
  },
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        title="Questions fréquentes"
        subtitle="Tout ce que vous devez savoir avant de vivre une expérience unique avec Even Travel."
        backgroundImage="/images/faq.png"
      />

      <section className="faq-container">
        <div className="faq-section-intro">
          <span className="eyebrow">FAQ</span>
          <h2>Réponses à vos questions</h2>
        </div>

        <FaqAccordion />
      </section>

      <section className="faq-cta">
        <h2>Une question spécifique ?</h2>
        <Link href="/contact" className="btn-primary">
          Contactez-nous
        </Link>
      </section>
    </>
  );
}
