import { XOF_PER_EUR, formatEUR, xofToEur } from "@/lib/format";

interface PriceEurProps {
  /** Montant en FCFA (XOF). */
  montant?: number | null;
  className?: string;
}

export function PriceEur({ montant, className = "" }: PriceEurProps) {
  if (!montant || montant <= 0) return null;

  const eur = xofToEur(montant);
  if (eur < 1) return null;

  return (
    <span
      className={`price-eur ${className}`.trim()}
      title={`Équivalent indicatif (1 € = ${XOF_PER_EUR.toLocaleString("fr-FR")} FCFA)`}
    >
      ≈ {formatEUR(eur)}
    </span>
  );
}
