import type { Metadata } from "next";

import { BlogExplorer } from "@/components/blog/BlogExplorer";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Retrouvez sur le blog Even Travel des récapitulatifs d'événements passés, des photos et les impressions de nos voyageurs.",
  openGraph: {
    title: "Blog — Even Travel",
    description: "Événements & Tourisme — récapitulatifs, photos et impressions de nos voyageurs.",
  },
};

export default function BlogPage() {
  return <BlogExplorer />;
}
