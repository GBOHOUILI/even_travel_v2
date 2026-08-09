import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://eventravel.example";
  const staticRoutes = ["", "/events", "/destinations", "/blog", "/contact", "/about", "/faq"];

  return staticRoutes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
  // TODO: une fois les pages [slug] migrées, ajouter dynamiquement les
  // événements/destinations/articles via les services API (features/*).
}
