import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EventDetail } from "@/components/events/EventDetail";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { eventsApi } from "@/features/events/api/events.api";
import { ApiError } from "@/lib/api";
import { canonicalUrl } from "@/lib/seo";
import { buildBreadcrumbSchema, buildEventSchema } from "@/lib/structuredData";

interface EventPageProps {
  params: Promise<{ id: string }>;
}

async function getEventOrNotFound(id: string) {
  try {
    return await eventsApi.getById(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const event = await eventsApi.getById(id);
    return {
      title: event.nom,
      description: event.description?.slice(0, 160),
      alternates: { canonical: canonicalUrl(`/events/${id}`) },
      openGraph: {
        title: event.nom,
        description: event.description?.slice(0, 160),
        images: event.images?.[0]?.url ? [event.images[0].url] : undefined,
      },
    };
  } catch {
    return { title: "Événement" };
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const event = await getEventOrNotFound(id);
  const url = canonicalUrl(`/events/${id}`);

  const breadcrumbItems = [
    { name: "Accueil", url: canonicalUrl("/") },
    { name: "Événements", url: canonicalUrl("/events") },
    { name: event.nom, url },
  ];

  return (
    <>
      <JsonLd data={buildEventSchema(event, url)} />
      <JsonLd data={buildBreadcrumbSchema(breadcrumbItems)} />
      <Breadcrumbs
        items={[
          { label: "Accueil", href: "/" },
          { label: "Événements", href: "/events" },
          { label: event.nom },
        ]}
      />
      <EventDetail event={event} />
    </>
  );
}
