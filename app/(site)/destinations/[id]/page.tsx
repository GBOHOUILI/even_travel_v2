import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DestinationDetail } from "@/components/destinations/DestinationDetail";
import { destinationsApi } from "@/features/destinations/api/destinations.api";
import { ApiError } from "@/lib/api";

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
    return {
      title: destination.titre,
      description: destination.description?.slice(0, 160),
      openGraph: {
        title: destination.titre,
        description: destination.description?.slice(0, 160),
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

  return <DestinationDetail destination={destination} />;
}
