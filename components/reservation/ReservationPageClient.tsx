"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { ReservationForm } from "@/components/reservation/ReservationForm";
import { ReservationHero } from "@/components/reservation/ReservationHero";
import { KkiapayScript } from "@/components/reservation/KkiapayScript";
import { ErrorState } from "@/components/ui/ErrorState";
import { Loader } from "@/components/ui/Loader";
import { useReservableItem } from "@/features/reservations/hooks/useReservableItem";
import type { ReservationType } from "@/types/reservation";

/**
 * Reprend la logique de détection des paramètres de l'original :
 * `?type=...&id=...` en priorité, sinon les anciens formats
 * `?eventId=...` / `?destinationId=...` pour rester compatible avec des
 * liens déjà partagés.
 */
function parseReservationParams(searchParams: URLSearchParams): {
  type?: ReservationType;
  id?: string;
} {
  const type = searchParams.get("type");
  const id = searchParams.get("id");
  if (type && id) return { type: type as ReservationType, id };

  const eventId = searchParams.get("eventId");
  if (eventId) return { type: "event", id: eventId };

  const destinationId = searchParams.get("destinationId");
  if (destinationId) return { type: "destination", id: destinationId };

  return {};
}

export function ReservationPageClient() {
  const searchParams = useSearchParams();
  const { type, id } = parseReservationParams(searchParams);
  const { data: item, isLoading, isError, refetch } = useReservableItem(type, id);

  const hasMissingParams = !type || !id;

  useEffect(() => {
    if (!hasMissingParams) return;
    const timeout = setTimeout(() => {
      window.location.href = "/";
    }, 2500);
    return () => clearTimeout(timeout);
  }, [hasMissingParams]);

  return (
    <>
      <KkiapayScript />
      <ReservationHero />

      <div className="reservation-container">
        <div className="reservation-form-container">
          {hasMissingParams && (
            <ErrorState
              message="Aucun événement ou destination sélectionné. Redirection vers l'accueil..."
              fallbackHref="/"
              fallbackLabel="Retourner à l'accueil maintenant"
            />
          )}

          {!hasMissingParams && isLoading && <Loader label="Chargement des détails de la réservation..." />}

          {!hasMissingParams && isError && (
            <ErrorState message="Impossible de charger les détails de la réservation." onRetry={() => refetch()} />
          )}

          {!hasMissingParams && item && type && <ReservationForm item={item} type={type} />}

          <div className="reservation-info-box">
            <i className="fas fa-info-circle" aria-hidden="true" />
            <p>
              <strong>Informations importantes :</strong> Votre réservation sera confirmée dans les 24 heures. Vous
              recevrez un email de confirmation avec tous les détails de votre voyage. Pour toute question,
              n&apos;hésitez pas à{" "}
              <Link href="/contact" style={{ color: "var(--terracotta)" }}>
                nous contacter
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
