import type { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { blogKeys } from "@/features/blog/api/blog.keys";
import { blogApi } from "@/features/blog/api/blog.api";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Retrouvez sur le blog Even Travel des récapitulatifs d'événements passés, des photos et les impressions de nos voyageurs.",
  alternates: { canonical: canonicalUrl("/blog") },
  openGraph: {
    title: "Blog — Even Travel",
    description: "Événements & Tourisme — récapitulatifs, photos et impressions de nos voyageurs.",
  },
};

export default async function BlogPage() {
  // Même logique de prefetch serveur que /destinations et /events.
  const queryClient = new QueryClient();
  await queryClient
    .prefetchQuery({
      queryKey: blogKeys.list(),
      queryFn: blogApi.getAll,
    })
    .catch(() => undefined);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogExplorer />
    </HydrationBoundary>
  );
}
