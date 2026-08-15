import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { PageHero } from "@/components/ui/PageHero";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez Even Travel à Cotonou pour vos réservations, demandes d'information ou partenariats. Réponse rapide par email ou téléphone.",
  alternates: { canonical: canonicalUrl("/contact") },
  openGraph: {
    title: "Contact — Even Travel",
    description: "Nous sommes là pour répondre à toutes vos questions.",
  },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contactez-nous"
        subtitle="Nous sommes là pour répondre à toutes vos questions"
        backgroundImage="/images/Contact.jpg"
      />

      <section className="contact-section">
        <div className="container">
          <div className="contact-container">
            <ContactForm />
            <ContactInfo />
          </div>
        </div>
      </section>
    </>
  );
}
