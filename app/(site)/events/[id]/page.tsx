import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EventDetail } from "@/components/events/EventDetail";
import { eventsApi } from "@/features/events/api/events.api";
import { ApiError } from "@/lib/api";

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

  return <EventDetail event={event} />;
}
