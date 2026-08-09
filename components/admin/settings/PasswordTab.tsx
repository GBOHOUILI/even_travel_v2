"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { PasswordStrengthGauge } from "@/components/admin/settings/PasswordStrengthGauge";
import { useUpdatePassword } from "@/features/auth/hooks/useUpdatePassword";
import { type PasswordFormValues, passwordFormSchema } from "@/features/auth/lib/settingsSchemas";
import { ApiError } from "@/lib/api";
import { useToast } from "@/providers/ToastProvider";

export function PasswordTab() {
  const updatePassword = useUpdatePassword();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");
  const [matchTouched, setMatchTouched] = useState(false);

  const onSubmit = handleSubmit((values) => {
    updatePassword.mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      {
        onSuccess: () => {
          showToast(
            "Mot de passe mis à jour avec succès ! Votre session a été renouvelée.",
            "success",
          );
          reset();
          setMatchTouched(false);
        },
        onError: (error) => {
          const message =
            error instanceof ApiError ? error.message : "Erreur lors de la mise à jour.";
          showToast(message, "error");
        },
      },
    );
  });

  const passwordsMatch = confirmPassword ? newPassword === confirmPassword : null;

  return (
    <div className="admin-settings-card">
      <div className="admin-settings-card-header">
        <div className="admin-settings-card-icon">
          <i className="fas fa-shield-alt" aria-hidden="true" />
        </div>
        <div>
          <h2>Changer le mot de passe</h2>
          <p>Renforcez la sécurité de votre compte avec un mot de passe robuste.</p>
        </div>
      </div>

      <div className="admin-settings-info-box">
        <strong>
          <i className="fas fa-info-circle" aria-hidden="true" /> Bonne pratique :
        </strong>{" "}
        Utilisez au moins 8 caractères, mélangez majuscules, chiffres et symboles.
      </div>

      <form onSubmit={onSubmit} noValidate>
        <div className="admin-form-group">
          <label htmlFor="currentPw">Mot de passe actuel</label>
          <input
            id="currentPw"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!errors.currentPassword}
            {...register("currentPassword")}
          />
          {errors.currentPassword && (
            <p className="admin-field-error">{errors.currentPassword.message}</p>
          )}
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label htmlFor="newPw">Nouveau mot de passe</label>
            <input
              id="newPw"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.newPassword}
              {...register("newPassword")}
            />
            <PasswordStrengthGauge password={newPassword ?? ""} />
            {errors.newPassword && (
              <p className="admin-field-error">{errors.newPassword.message}</p>
            )}
          </div>
          <div className="admin-form-group">
            <label htmlFor="confirmPw">Confirmer le mot de passe</label>
            <input
              id="confirmPw"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword", { onChange: () => setMatchTouched(true) })}
            />
            {matchTouched && passwordsMatch !== null && (
              <span
                className={
                  passwordsMatch ? "admin-field-hint-success" : "admin-field-hint-error"
                }
              >
                {passwordsMatch
                  ? "✓ Les mots de passe correspondent"
                  : "✗ Les mots de passe ne correspondent pas"}
              </span>
            )}
            {errors.confirmPassword && (
              <p className="admin-field-error">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <div className="admin-settings-btn-row">
          <button
            type="submit"
            className="admin-save-btn"
            disabled={isSubmitting || updatePassword.isPending}
          >
            {updatePassword.isPending ? "Mise à jour..." : "Mettre à jour le mot de passe"}
          </button>
          <button
            type="button"
            className="admin-cancel-modal-btn"
            onClick={() => {
              reset();
              setMatchTouched(false);
            }}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
