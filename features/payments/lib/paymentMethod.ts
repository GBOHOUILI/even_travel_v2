const METHOD_LABELS: Record<string, string> = {
  mtn: "MTN MoMo",
  moov: "Moov Money",
  carte: "Carte bancaire",
  card_xof: "Carte (XOF)",
  mtn_bj: "MTN MoMo BJ",
  moov_bj: "Moov BJ",
  paypal: "PayPal",
};

export function getPaymentMethodLabel(method: string | undefined): string {
  if (!method) return "—";
  return METHOD_LABELS[method] ?? method;
}
