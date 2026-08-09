"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { PasswordStrengthGauge } from "@/components/admin/settings/PasswordStrengthGauge";
import { useRegisterAdmin } from "@/features/auth/hooks/useRegisterAdmin";
import { type NewAdminFormValues, newAdminFormSchema } from "@/features/auth/lib/settingsSchemas";
import { ApiError } from "@/lib/api";
import { useToast } from "@/providers/ToastProvider";

export function NewAdminTab() {
  const registerAdmin = useRegisterAdmin();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<NewAdminFormValues>({
    resolver: zodResolver(newAdminFormSchema),
    defaultValues: { nom: "", email: "", password: "", confirmPassword: "" },
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const [matchTouched, setMatchTouched] = useState(false);

  const onSubmit = handleSubmit((values) => {
    registerAdmin.mutate(
      { nom: values.nom, email: values.email, password: values.password },
      {
        onSuccess: (admin) => {
          showToast(`Compte administrateur créé avec succès pour ${admin.nom} (${admin.email}).`, "success");
          reset();
          setMatchTouched(false);
        },
        onError: (error) => {
          const message =
            error instanceof ApiError ? error.message : "Erreur lors de la création.";
          showToast(message, "error");
        },
      },
    );
  });

  const passwordsMatch = confirmPassword ? password === confirmPassword : null;

  return (
    <>
      <div className="admin-settings-warning-box">
        <strong>
          <i className="fas fa-exclamation-triangle" aria-hidden="true" /> Attention :
        </strong>{" "}
        La création d&apos;un nouveau compte administrateur accorde un accès complet au panneau
        d&apos;administration. Ne partagez ces identifiants qu&apos;avec des personnes de confiance.
      </div>

      <div className="admin-settings-card">
        <div className="admin-settings-card-header">
          <div className="admin-settings-card-icon">
            <i className="fas fa-user-plus" aria-hidden="true" />
          </div>
          <div>
            <h2>Créer un nouveau compte admin</h2>
            <p>Ce compte aura accès à toutes les fonctionnalités du tableau de bord.</p>
          </div>
        </div>

        <form onSubmit={onSubmit} noValidate>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label htmlFor="newAdminNom">Nom complet *</label>
              <input
                id="newAdminNom"
                type="text"
                aria-invalid={!!errors.nom}
                {...register("nom")}
              />
              {errors.nom && <p className="admin-field-error">{errors.nom.message}</p>}
            </div>
            <div className="admin-form-group">
              <label htmlFor="newAdminEmail">Email *</label>
              <input
                id="newAdminEmail"
                type="email"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && <p className="admin-field-error">{errors.email.message}</p>}
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label htmlFor="newAdminPw">Mot de passe *</label>
              <input
                id="newAdminPw"
                type="password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              <PasswordStrengthGauge password={password ?? ""} />
              {errors.password && <p className="admin-field-error">{errors.password.message}</p>}
            </div>
            <div className="admin-form-group">
              <label htmlFor="newAdminPwConfirm">Confirmer le mot de passe *</label>
              <input
                id="newAdminPwConfirm"
                type="password"
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
              disabled={isSubmitting || registerAdmin.isPending}
            >
              {registerAdmin.isPending ? "Création..." : "Créer le compte administrateur"}
            </button>
            <button
              type="button"
              className="admin-cancel-modal-btn"
              onClick={() => {
                reset();
                setMatchTouched(false);
              }}
            >
              Réinitialiser
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
