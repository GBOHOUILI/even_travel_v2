import { SITE_URL } from "@/constants/config";

/**
 * Construit une URL canonique absolue à partir d'un chemin relatif.
 *
 * `metadataBase` (défini dans app/layout.tsx) permet à Next.js de résoudre
 * les URLs relatives des images Open Graph, mais NE génère PAS
 * automatiquement de balise <link rel="canonical">. Chaque page doit donc
 * déclarer explicitement `alternates.canonical` — ce helper centralise la
 * construction de cette URL pour éviter les incohérences (slash final,
 * domaine en dur, etc.) page par page.
 *
 * @param path Chemin relatif commençant par "/" (ex: "/destinations/ouidah")
 */
export function canonicalUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}
