import { calculerTotal, formatFCFA } from "@/features/reservations/lib/pricing";
import type { PaymentPlan } from "@/types/reservation";

interface ReservationPriceDisplayProps {
  prixUnitaire: number;
  participants: number;
  plan: PaymentPlan;
}

export function ReservationPriceDisplay({ prixUnitaire, participants, plan }: ReservationPriceDisplayProps) {
  const { total, aPayer } = calculerTotal(prixUnitaire, participants, plan);

  return (
    <div className="reservation-price-display">
      <div className="reservation-price-grid">
        <div className="reservation-price-item">
          <div className="reservation-price-label">Prix unitaire</div>
          <div className="reservation-price-value">{formatFCFA(prixUnitaire)}</div>
        </div>
        <div className="reservation-price-item">
          <div className="reservation-price-label">Nombre de personnes</div>
          <div className="reservation-price-value">{participants}</div>
        </div>
      </div>
      <div className="reservation-price-total">
        <div className="reservation-total-row">
          <div className="reservation-total-label">Total</div>
          <div className="reservation-total-amount">{formatFCFA(total)}</div>
        </div>
      </div>
      <div className="reservation-payment-due">
        <div className="reservation-payment-due-label">À payer maintenant</div>
        <div className="reservation-payment-due-amount">{formatFCFA(aPayer)}</div>
      </div>
    </div>
  );
}
