import type { PaymentPlan } from "@/types/reservation";

export { formatFCFA } from "@/lib/format";

export interface PricingResult {
  total: number;
  aPayer: number;
}

export function calculerTotal(
  prixUnitaire: number,
  nombrePlaces: number,
  plan: PaymentPlan,
): PricingResult {
  const total = prixUnitaire * nombrePlaces;
  const aPayer = plan === "deux_tranches" ? Math.ceil(total / 2) : total;
  return { total, aPayer };
}
