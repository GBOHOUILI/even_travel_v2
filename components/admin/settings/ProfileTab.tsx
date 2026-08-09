"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useAdminMe } from "@/features/auth/hooks/useAdminMe";
import { useUpdateProfile } from "@/features/auth/hooks/useUpdateProfile";
import { type ProfileFormValues, profileFormSchema } from "@/features/auth/lib/settingsSchemas";
import { ApiError } from "@/lib/api";
import { useToast } from "@/providers/ToastProvider";

export function ProfileTab() {
  const { data: admin } = useAdminMe();
  const updateProfile = useUpdateProfile();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { nom: "", email: "" },
  });

  useEffect(() => {
    if (admin) reset({ nom: admin.nom, email: admin.email });
  }, [admin, reset]);

  const onSubmit = handleSubmit((values) => {
    updateProfile.mutate(values, {
      onSuccess: () => showToast("Profil mis à jour avec succès !", "success"),
      onError: (error) => {
        const message =
          error instanceof ApiError ? error.message : "Erreur lors de la mise à jour.";
        showToast(message, "error");
      },
    });
  });

  return (
    <div className="admin-settings-card">
      <div className="admin-settings-card-header">
        <div className="admin-settings-card-icon">
          <i className="fas fa-id-card" aria-hidden="true" />
        </div>
        <div>
          <h2>Informations du compte</h2>
          <p>Modifiez votre nom d&apos;affichage et votre adresse email de connexion.</p>
        </div>
      </div>

      {admin && (
        <div className="admin-settings-profile-display">
          <div className="admin-settings-avatar">{admin.nom.charAt(0).toUpperCase()}</div>
          <div>
            <h3>{admin.nom}</h3>
            <p>{admin.email}</p>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} noValidate>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label htmlFor="inputNom">Nom d&apos;affichage</label>
            <input id="inputNom" type="text" aria-invalid={!!errors.nom} {...register("nom")} />
            {errors.nom && <p className="admin-field-error">{errors.nom.message}</p>}
          </div>
          <div className="admin-form-group">
            <label htmlFor="inputEmail">Adresse email</label>
            <input
              id="inputEmail"
              type="email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && <p className="admin-field-error">{errors.email.message}</p>}
          </div>
        </div>
        <div className="admin-settings-btn-row">
          <button
            type="submit"
            className="admin-save-btn"
            disabled={isSubmitting || updateProfile.isPending}
          >
            {updateProfile.isPending ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
          <button
            type="button"
            className="admin-cancel-modal-btn"
            onClick={() => admin && reset({ nom: admin.nom, email: admin.email })}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
