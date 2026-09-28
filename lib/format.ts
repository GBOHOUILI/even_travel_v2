/** Parité fixe FCFA/EUR (1 € = 655,957 FCFA). L'EUR sert uniquement à l'affichage. */
export const XOF_PER_EUR = 655.957;

export function formatFCFA(montant: number): string {
  return `${montant.toLocaleString("fr-FR")} FCFA`;
}

export function xofToEur(montantXof: number): number {
  return Math.round(montantXof / XOF_PER_EUR);
}

export function formatEUR(montantEur: number): string {
  return `${montantEur.toLocaleString("fr-FR")}\u00a0€`;
}

export function formatPrice(prix?: number | null): string {
  if (prix === undefined || prix === null) return "Sur demande";
  if (prix === 0) return "Gratuit";
  return formatFCFA(prix);
}

export function truncate(text: string | undefined, length: number): string {
  if (!text) return "";
  return text.length > length ? `${text.slice(0, length)}…` : text;
}
