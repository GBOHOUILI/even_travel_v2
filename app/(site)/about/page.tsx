import type { Metadata } from "next";

import { AboutIntro } from "@/components/about/AboutIntro";
import { AboutMission } from "@/components/about/AboutMission";
import { AboutStory } from "@/components/about/AboutStory";
import { AboutValues } from "@/components/about/AboutValues";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Even Travel, agence de tourisme à Cotonou : notre mission éducative et humanitaire en Afrique, nos valeurs et notre vision du voyage responsable.",
  openGraph: {
    title: "À propos — Even Travel",
    description:
      "Notre mission éducative et humanitaire, nos valeurs et notre vision du voyage responsable.",
  },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="À propos"
        subtitle="Votre agence de voyage et de tourisme"
        backgroundImage="/images/about.jpg"
      />
      <main>
        <AboutIntro />
        <AboutStory />
        <AboutMission />
        <AboutValues />
      </main>
    </>
  );
}
