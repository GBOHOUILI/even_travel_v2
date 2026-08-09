export function createExcerpt(contenu: string, maxLength = 120): string {
  const plainText = contenu.replace(/<[^>]*>/g, "").trim();
  if (plainText.length <= maxLength) return plainText;
  return `${plainText.slice(0, maxLength).trim()}...`;
}

export function getInitials(name?: string): string {
  if (!name) return "A";
  return name.charAt(0).toUpperCase();
}

/**
 * Identique à l'original : "Aujourd'hui" / "Hier" / "Il y a N jours" en
 * dessous d'une semaine, sinon une date localisée.
 */
export function formatRelativeDate(dateString?: string): string {
  if (!dateString) return "Date inconnue";

  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;

  return date.toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "numeric" });
}
