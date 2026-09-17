export function formatPrice(prix?: number | null): string {
  if (prix === undefined || prix === null) return "Sur demande";
  if (prix === 0) return "Gratuit";
  return `${prix.toLocaleString("fr-FR")} FCFA`;
}

export function truncate(text: string | undefined, length: number): string {
  if (!text) return "";
  return text.length > length ? `${text.slice(0, length)}…` : text;
}
