export function formatPrice(prix?: number): string {
  if (prix === undefined || prix === null) return "Prix sur demande";
  return `${prix.toLocaleString("fr-FR")} FCFA`;
}

export function truncate(text: string | undefined, length: number): string {
  if (!text) return "";
  return text.length > length ? `${text.slice(0, length)}…` : text;
}
