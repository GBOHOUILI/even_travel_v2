import { PriceEur } from "@/components/ui/PriceEur";
import { calculerTotal } from "@/features/reservations/lib/pricing";
import { formatFCFA } from "@/lib/format";
import type { PaymentPlan } from "@/types/reservation";

interface ReservationPriceDisplayProps {
  prixUnitaire: number;
  participants: number;
  plan: PaymentPlan;
}

export function ReservationPriceDisplay({
  prixUnitaire,
  participants,
  plan,
}: ReservationPriceDisplayProps) {
  const { total, aPayer } = calculerTotal(prixUnitaire, participants, plan);

  return (
    <div className="reservation-price-display">
      <div className="reservation-price-grid">
        <div className="reservation-price-item">
          <div className="reservation-price-label">Prix unitaire</div>
          <div className="reservation-price-value">
            {formatFCFA(prixUnitaire)}
            <PriceEur montant={prixUnitaire} />
          </div>
        </div>
        <div className="reservation-price-item">
          <div className="reservation-price-label">Nombre de personnes</div>
          <div className="reservation-price-value">{participants}</div>
        </div>
      </div>
      <div className="reservation-price-total">
        <div className="reservation-total-row">
          <div className="reservation-total-label">Total</div>
          <div className="reservation-total-amount">
            {formatFCFA(total)}
            <PriceEur montant={total} />
          </div>
        </div>
      </div>
      <div className="reservation-payment-due">
        <div className="reservation-payment-due-label">À payer maintenant</div>
        <div className="reservation-payment-due-amount">
          {formatFCFA(aPayer)}
          <PriceEur montant={aPayer} />
        </div>
      </div>
      <p className="price-eur-note">
        Le paiement s’effectue en FCFA (XOF). L’équivalent en euros est donné à titre indicatif (1 €
        = 655,957 FCFA).
      </p>
    </div>
  );
}
