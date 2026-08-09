import { calculerTotal, formatFCFA } from "@/features/reservations/lib/pricing";
import type { ReservableItem } from "@/features/reservations/hooks/useReservableItem";
import type { PaymentPlan, ReservationType } from "@/types/reservation";

interface ReservationSummaryProps {
  item: ReservableItem;
  type: ReservationType;
  participants: number;
  plan: PaymentPlan;
}

export function ReservationSummary({ item, type, participants, plan }: ReservationSummaryProps) {
  const { total } = calculerTotal(item.prix, participants, plan);

  return (
    <div className="reservation-summary">
      <div className="reservation-summary-header">
        <div className="reservation-summary-title">Résumé de votre réservation</div>
        <div className="reservation-summary-badge">{type === "event" ? "Événement" : "Destination"}</div>
      </div>
      <div className="reservation-summary-content">
        <div className="reservation-summary-item">
          <div className="reservation-summary-label">Événement/Destination</div>
          <div className="reservation-summary-value">{item.nom}</div>
        </div>
        <div className="reservation-summary-item">
          <div className="reservation-summary-label">Lieu</div>
          <div className="reservation-summary-value">{item.lieu}</div>
        </div>
        <div className="reservation-summary-item">
          <div className="reservation-summary-label">Prix unitaire</div>
          <div className="reservation-summary-value">{formatFCFA(item.prix)}</div>
        </div>
      </div>
      <div className="reservation-summary-price">
        <div className="reservation-summary-label">Total pour {participants} personne(s)</div>
        <div className="amount">{formatFCFA(total)}</div>
      </div>
    </div>
  );
}
