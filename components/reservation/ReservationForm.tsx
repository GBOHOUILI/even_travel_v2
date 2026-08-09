"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { ReservationPriceDisplay } from "@/components/reservation/ReservationPriceDisplay";
import { ReservationSummary } from "@/components/reservation/ReservationSummary";
import { useVerifyPayment } from "@/features/payments/hooks/useVerifyPayment";
import { getDefaultDate, getTodayISO } from "@/features/reservations/lib/defaultDate";
import { buildReservationSchema, type ReservationFormValues } from "@/features/reservations/lib/reservationSchema";
import { useInitierReservation } from "@/features/reservations/hooks/useInitierReservation";
import { useKkiapayWidget } from "@/features/reservations/hooks/useKkiapayWidget";
import type { ReservableItem } from "@/features/reservations/hooks/useReservableItem";
import { ApiError } from "@/lib/api";
import { useToast } from "@/providers/ToastProvider";
import type { ReservationType } from "@/types/reservation";

const PAYMENT_PLANS = [
  { value: "unique", label: "Paiement en une fois", icon: "fa-credit-card" },
  { value: "deux_tranches", label: "Paiement en deux tranches", icon: "fa-calendar-alt" },
] as const;

const PAYMENT_METHODS = [
  { value: "carte", label: "Carte bancaire", icon: "fa-credit-card", brand: "fas" },
  { value: "mtn", label: "MTN MoMo", icon: "fa-mobile-alt", brand: "fas" },
  { value: "moov", label: "Moov Money", icon: "fa-mobile-alt", brand: "fas" },
] as const;

interface ReservationFormProps {
  item: ReservableItem;
  type: ReservationType;
}

export function ReservationForm({ item, type }: ReservationFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const initierReservation = useInitierReservation();
  const verifyPayment = useVerifyPayment();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const pendingReservationId = useRef<string | null>(null);

  const { open: openKkiapayWidget } = useKkiapayWidget({
    onSuccess: async (event) => {
      const reservationId = pendingReservationId.current;
      if (!reservationId) return;

      try {
        await verifyPayment.mutateAsync({ transactionId: event.transactionId, reservationId });
        showToast("Paiement confirmé ! Merci pour votre confiance.", "success");
        router.push(`/paiement?reservationId=${reservationId}&status=success`);
      } catch (error) {
        // "already_paid" peut survenir si le succès du widget se déclenche
        // deux fois (double appel de verify) — ce n'est pas un échec du
        // point de vue de l'utilisateur, la réservation est bien payée.
        if (error instanceof ApiError && error.code === "already_paid") {
          showToast("Réservation déjà payée.", "success");
          router.push(`/paiement?reservationId=${reservationId}&status=already_paid`);
          return;
        }

        const message =
          error instanceof ApiError ? error.message : "La vérification du paiement a échoué.";
        setSubmitError(message);
        showToast(message, "error");
      }
    },
    onFailed: () => {
      showToast("Le paiement a été annulé ou a échoué. Vous pouvez réessayer.", "error");
    },
  });

  const schema = buildReservationSchema(item.placesDisponibles);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      participants: 1,
      date: getDefaultDate(item.date),
      message: "",
      plan: "unique",
      methode: "carte",
    },
  });

  const participants = watch("participants") || 1;
  const plan = watch("plan");

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      const { reservation, kkiapay } = await initierReservation.mutateAsync({
        client: { nom: values.nom, prenom: values.prenom, email: values.email, telephone: values.telephone },
        type,
        itemId: item._id,
        date: values.date,
        nombrePlaces: values.participants,
        message: values.message,
        planPaiement: values.plan,
        methodePaiement: values.methode,
      });

      pendingReservationId.current = reservation._id;

      showToast("Réservation enregistrée ! Ouverture du paiement sécurisé...", "success");
      openKkiapayWidget({
        amount: kkiapay.amount,
        api_key: kkiapay.publicKey,
        sandbox: kkiapay.sandbox,
        data: JSON.stringify(kkiapay.data),
      });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Une erreur est survenue pendant le traitement de la réservation.";
      setSubmitError(message);
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <ReservationSummary item={item} type={type} participants={participants} plan={plan} />

      <h2 className="reservation-section-title">Informations personnelles</h2>
      <div className="reservation-form-row">
        <div className="reservation-form-group">
          <label htmlFor="nom">Nom *</label>
          <input id="nom" {...register("nom")} aria-invalid={!!errors.nom} />
          {errors.nom && <p className="reservation-field-error">{errors.nom.message}</p>}
        </div>
        <div className="reservation-form-group">
          <label htmlFor="prenom">Prénom *</label>
          <input id="prenom" {...register("prenom")} aria-invalid={!!errors.prenom} />
          {errors.prenom && <p className="reservation-field-error">{errors.prenom.message}</p>}
        </div>
      </div>

      <div className="reservation-form-row">
        <div className="reservation-form-group">
          <label htmlFor="email">Email *</label>
          <input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
          {errors.email && <p className="reservation-field-error">{errors.email.message}</p>}
        </div>
        <div className="reservation-form-group">
          <label htmlFor="telephone">Téléphone *</label>
          <input id="telephone" type="tel" {...register("telephone")} aria-invalid={!!errors.telephone} />
          {errors.telephone && <p className="reservation-field-error">{errors.telephone.message}</p>}
        </div>
      </div>

      <h2 className="reservation-section-title">Détails de la réservation</h2>
      <div className="reservation-form-row">
        <div className="reservation-form-group">
          <label htmlFor="participants">Nombre de personnes *</label>
          <Controller
            control={control}
            name="participants"
            render={({ field }) => (
              <input
                id="participants"
                type="number"
                min={1}
                max={item.placesDisponibles}
                value={field.value}
                onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 1)}
                aria-invalid={!!errors.participants}
              />
            )}
          />
          {errors.participants && <p className="reservation-field-error">{errors.participants.message}</p>}
          {item.placesDisponibles <= 10 && (
            <div className="reservation-places-warning">
              <i className="fas fa-exclamation-circle" aria-hidden="true" />
              Il ne reste que {item.placesDisponibles} place{item.placesDisponibles > 1 ? "s" : ""} disponible
              {item.placesDisponibles > 1 ? "s" : ""}
            </div>
          )}
        </div>
        <div className="reservation-form-group">
          <label htmlFor="selectedDate">Date de participation *</label>
          <input id="selectedDate" type="date" min={getTodayISO()} {...register("date")} aria-invalid={!!errors.date} />
          {errors.date && <p className="reservation-field-error">{errors.date.message}</p>}
        </div>
      </div>

      <div className="reservation-form-group">
        <label htmlFor="message">Message / Demandes spéciales</label>
        <textarea
          id="message"
          placeholder="Vos demandes particulières, besoins spécifiques..."
          {...register("message")}
        />
      </div>

      <ReservationPriceDisplay prixUnitaire={item.prix} participants={participants} plan={plan} />

      <div className="reservation-payment-section">
        <h2 className="reservation-section-title">Plan de paiement</h2>
        <div className="reservation-payment-options">
          {PAYMENT_PLANS.map((option) => (
            <label
              key={option.value}
              className={`reservation-box-option ${plan === option.value ? "selected" : ""}`}
            >
              <input type="radio" value={option.value} {...register("plan")} />
              <i className={`fas ${option.icon}`} aria-hidden="true" />
              <div>{option.label}</div>
            </label>
          ))}
        </div>

        <h2 className="reservation-section-title">Méthode de paiement</h2>
        <div className="reservation-payment-methods">
          {PAYMENT_METHODS.map((option) => (
            <label key={option.value} className="reservation-box-option">
              <input type="radio" value={option.value} {...register("methode")} />
              <i className={`${option.brand} ${option.icon}`} aria-hidden="true" />
              <div>{option.label}</div>
            </label>
          ))}
        </div>
      </div>

      {submitError && (
        <p className="reservation-field-error" role="alert" style={{ marginTop: "var(--spacing-sm)" }}>
          <i className="fas fa-exclamation-triangle" aria-hidden="true" /> {submitError}
        </p>
      )}

      <button
        type="submit"
        className="reservation-submit-btn"
        disabled={initierReservation.isPending || verifyPayment.isPending}
      >
        <i
          className={`fas ${initierReservation.isPending || verifyPayment.isPending ? "fa-spinner fa-spin" : "fa-check-circle"}`}
          aria-hidden="true"
        />
        {initierReservation.isPending
          ? "Traitement..."
          : verifyPayment.isPending
            ? "Vérification du paiement..."
            : "Confirmer la réservation"}
      </button>
      <p className="reservation-terms">En validant, vous acceptez nos conditions générales de vente</p>
    </form>
  );
}
