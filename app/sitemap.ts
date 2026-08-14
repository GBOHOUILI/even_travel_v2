import type { MetadataRoute } from "next";

import { SITE_URL } from "@/constants/config";
import { destinationsApi } from "@/features/destinations/api/destinations.api";
import { eventsApi } from "@/features/events/api/events.api";
import { blogApi } from "@/features/blog/api/blog.api";

const staticRoutes = ["", "/events", "/destinations", "/blog", "/contact", "/about", "/faq"];

// Le sitemap est généré à la requête (pas au build) : si le backend ne
// répond pas (cold start Render, panne...), on ne fait pas planter la
// route — on retombe sur les routes statiques seules plutôt que de
// renvoyer un sitemap.xml en erreur 500 à Google.
async function safeGetAll<T>(fn: () => Promise<T[]>): Promise<T[]> {
  try {
    return await fn();
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [destinations, events, articles] = await Promise.all([
    safeGetAll(destinationsApi.getAll),
    safeGetAll(() => eventsApi.getAll()),
    safeGetAll(blogApi.getAll),
  ]);

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const destinationEntries: MetadataRoute.Sitemap = destinations.map((d) => ({
    url: `${SITE_URL}/destinations/${d._id}`,
    lastModified: d.updatedAt ? new Date(d.updatedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const eventEntries: MetadataRoute.Sitemap = events.map((e) => ({
    url: `${SITE_URL}/events/${e._id}`,
    lastModified: e.updatedAt ? new Date(e.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/blog/${a.slug}`,
    lastModified: a.updatedAt ? new Date(a.updatedAt) : new Date(a.createdAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...destinationEntries, ...eventEntries, ...articleEntries];
}
