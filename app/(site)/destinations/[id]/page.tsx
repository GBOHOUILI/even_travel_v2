import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DestinationDetail } from "@/components/destinations/DestinationDetail";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { destinationsApi } from "@/features/destinations/api/destinations.api";
import { ApiError } from "@/lib/api";
import { canonicalUrl } from "@/lib/seo";
import { buildBreadcrumbSchema, buildTouristDestinationSchema } from "@/lib/structuredData";

interface DestinationPageProps {
  params: Promise<{ id: string }>;
}

async function getDestinationOrNotFound(id: string) {
  try {
    return await destinationsApi.getById(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

export async function generateMetadata({ params }: DestinationPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const destination = await destinationsApi.getById(id);
    // Priorité au champ SEO dédié du CMS (metaDescription), pensé pour ça,
    // plutôt qu'à une simple troncature de la description éditoriale.
    const description = destination.metaDescription || destination.description?.slice(0, 160);
    return {
      title: destination.titre,
      description,
      alternates: { canonical: canonicalUrl(`/destinations/${id}`) },
      openGraph: {
        title: destination.titre,
        description,
        images: destination.images?.[0]?.url ? [destination.images[0].url] : undefined,
      },
    };
  } catch {
    return { title: "Destination" };
  }
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const { id } = await params;
  const destination = await getDestinationOrNotFound(id);
  const url = canonicalUrl(`/destinations/${id}`);

  const breadcrumbItems = [
    { name: "Accueil", url: canonicalUrl("/") },
    { name: "Destinations", url: canonicalUrl("/destinations") },
    { name: destination.titre, url },
  ];

  return (
    <>
      <JsonLd data={buildTouristDestinationSchema(destination, url)} />
      <JsonLd data={buildBreadcrumbSchema(breadcrumbItems)} />
      <Breadcrumbs
        items={[
          { label: "Accueil", href: "/" },
          { label: "Destinations", href: "/destinations" },
          { label: destination.titre },
        ]}
      />
      <DestinationDetail destination={destination} />
    </>
  );
}
