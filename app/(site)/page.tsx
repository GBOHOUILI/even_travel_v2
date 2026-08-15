import type { Metadata } from "next";

import { AboutSection } from "@/components/home/AboutSection";
import { Activities } from "@/components/home/Activities";
import { CtaSection } from "@/components/home/CtaSection";
import { DestinationsGrid } from "@/components/home/DestinationsGrid";
import { FeaturedDestinationsCarousel } from "@/components/home/FeaturedDestinationsCarousel";
import { Hero } from "@/components/home/Hero";
import { HomeRevealObserver } from "@/components/home/HomeRevealObserver";
import { Intro } from "@/components/home/Intro";
import { Services } from "@/components/home/Services";
import { UpcomingEventsCarousel } from "@/components/home/UpcomingEventsCarousel";
import { ValueProps } from "@/components/home/ValueProps";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Accueil",
  description:
    "Even Travel — Circuit et Immersion. Agence de tourisme à Cotonou : voyages sur mesure, écotourisme et circuits culturels en Afrique.",
  alternates: { canonical: canonicalUrl("/") },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <main>
        <Intro />
        <Activities />
        <ValueProps />
        <DestinationsGrid />
        <FeaturedDestinationsCarousel />
        <UpcomingEventsCarousel />
        <Services />
        <CtaSection />
        <AboutSection />
      </main>
      <HomeRevealObserver />
    </>
  );
}
