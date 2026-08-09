"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { useLogin } from "@/features/auth/hooks/useLogin";
import { loginSchema, type LoginFormValues } from "@/features/auth/lib/loginSchema";
import { ApiError } from "@/lib/api";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) => {
    login.mutate(values, {
      onSuccess: () => {
        const redirectTo = searchParams.get("from") || "/admin";
        router.replace(redirectTo);
      },
    });
  });

  const errorMessage =
    login.error instanceof ApiError
      ? login.error.message
      : login.isError
        ? "Erreur de connexion."
        : null;

  return (
    <form className="admin-login-form" onSubmit={onSubmit} noValidate>
      <div className="admin-login-security-notice">
        <strong>🔒 Sécurité :</strong> Cette page est protégée. Seuls les administrateurs autorisés
        peuvent accéder au panneau d&apos;administration.
      </div>

      <div className="admin-form-group">
        <label htmlFor="email">Nom d&apos;utilisateur</label>
        <input
          id="email"
          type="email"
          placeholder="Entrez votre nom d'utilisateur"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && <p className="admin-field-error">{errors.email.message}</p>}
      </div>

      <div className="admin-form-group">
        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          type="password"
          placeholder="Entrez votre mot de passe"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        {errors.password && <p className="admin-field-error">{errors.password.message}</p>}
      </div>

      {errorMessage && <div className="admin-login-error">{errorMessage}</div>}

      <button type="submit" className="admin-login-btn" disabled={login.isPending}>
        {login.isPending ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}
