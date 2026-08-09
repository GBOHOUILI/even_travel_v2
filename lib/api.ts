import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { API_BASE_URL } from "@/constants/config";

/**
 * Client Axios UNIQUE de l'application.
 * Toute requête HTTP vers le backend doit passer par cette instance
 * (jamais de fetch() ou d'axios.create() ailleurs dans le code).
 *
 * Authentification :
 * `withCredentials` N'EST PAS activé par défaut ici. Une requête
 * credentialed (cookies) reçue par un serveur qui répond avec un CORS
 * wildcard (`Access-Control-Allow-Origin: *`, courant sur une API
 * publique comme /destinations ou /events) est silencieusement rejetée
 * par le navigateur — c'est ce qui empêchait les destinations de
 * s'afficher. Les endpoints publics (destinations, events, articles)
 * n'ont pas besoin de cookie.
 *
 * Pour les endpoints qui en ont besoin (login/logout/me, création de
 * réservation authentifiée...), passer explicitement l'option par
 * requête : `apiClient.get(url, { withCredentials: true })`. Un client
 * dédié `authApiClient` pourra être introduit à l'étape Admin si le
 * besoin devient systématique.
 *
 * ⚠️ Point à valider avec l'équipe backend : que les endpoints
 * d'authentification posent bien un cookie `HttpOnly; Secure;
 * SameSite=Lax` et acceptent les requêtes credentialed (CORS avec
 * origin explicite, pas de wildcard, + `Access-Control-Allow-Credentials: true`).
 *
 * Timeout à 30s (au lieu de 15s) : le backend est hébergé sur le tier
 * gratuit de Render, qui met le service en veille après inactivité — le
 * premier appel après une période creuse peut prendre 20-50s (cold start).
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
  headers: {
    Accept: "application/json",
  },
});

// Intercepteur de requête : point d'extension (ex: headers dynamiques, locale…)
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => config);

// Intercepteur de réponse : normalise les erreurs et gère le 401 (session expirée)
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; code?: string }>) => {
    if (error.response?.status === 401) {
      // La session a expiré ou l'utilisateur n'est pas authentifié.
      // Le middleware Next.js (middleware.ts) est responsable de la
      // redirection des routes /admin protégées ; ici on se contente
      // de propager une ApiError normalisée pour l'UI (toast, etc.)
    }

    return Promise.reject(normalizeApiError(error));
  },
);

export class ApiError extends Error {
  readonly status?: number;
  readonly code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

function normalizeApiError(error: AxiosError<{ message?: string; code?: string }>): ApiError {
  if (error.response) {
    const message =
      error.response.data?.message ?? "Une erreur est survenue lors de la communication avec le serveur.";
    // Le backend renvoie un code machine-readable optionnel sur les
    // erreurs "métier" (AppError), ex: "already_paid", "not_enough_seats",
    // "payment_failed", "amount_mismatch" — voir src/utils/AppError.js et
    // errorHandler.js côté backend. Sans ce champ, impossible de
    // distinguer ces cas d'une erreur générique côté UI.
    return new ApiError(message, error.response.status, error.response.data?.code);
  }

  if (error.request) {
    return new ApiError("Impossible de contacter le serveur. Vérifiez votre connexion.", undefined, "NETWORK_ERROR");
  }

  return new ApiError(error.message || "Une erreur inattendue est survenue.");
}
