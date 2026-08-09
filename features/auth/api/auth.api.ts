import { apiClient } from "@/lib/api";
import type {
  AdminUser,
  AuthMeResponse,
  LoginPayload,
  RegisterAdminPayload,
  UpdateMePayload,
  UpdatePasswordPayload,
} from "@/types/admin";

/**
 * Toutes les requêtes de ce module passent `withCredentials: true` : ce
 * sont les seules de l'application qui en ont besoin (cf. commentaire
 * dans lib/api.ts). Confirmé contre even-travel-backend-v2
 * (authController.js / authRoutes.js) :
 * - le cookie posé par /auth/login s'appelle `jwt` (HttpOnly).
 * - `/auth/logout` est un GET, pas un POST.
 * - toutes les réponses renvoient `data.admin`, jamais `data.user`.
 *
 * ⚠️ /auth/register n'est PROTÉGÉE PAR AUCUN MIDDLEWARE côté backend
 * actuellement (authRoutes.js : `router.post("/register", ...)` sans
 * `protect`) — n'importe qui connaissant l'URL peut créer un compte
 * admin sans être authentifié. À corriger côté backend avant mise en
 * prod de l'onglet "Nouveau compte". On envoie quand même
 * `withCredentials` ici pour que ça fonctionne dès que le backend
 * ajoutera `protect` sur cette route.
 */
export const authApi = {
  login: async (payload: LoginPayload): Promise<AdminUser> => {
    const { data } = await apiClient.post<AuthMeResponse>("/auth/login", payload, {
      withCredentials: true,
    });
    return data.data.admin;
  },

  logout: async (): Promise<void> => {
    await apiClient.get("/auth/logout", { withCredentials: true });
  },

  me: async (): Promise<AdminUser> => {
    const { data } = await apiClient.get<AuthMeResponse>("/auth/me", { withCredentials: true });
    return data.data.admin;
  },

  updateMe: async (payload: UpdateMePayload): Promise<AdminUser> => {
    const { data } = await apiClient.patch<AuthMeResponse>("/auth/update-me", payload, {
      withCredentials: true,
    });
    return data.data.admin;
  },

  /** Le backend renvoie un nouveau token (donc un nouveau cookie `jwt`) —
   * on récupère aussi l'admin pour rafraîchir le cache sans refaire un
   * appel à /auth/me. */
  updatePassword: async (payload: UpdatePasswordPayload): Promise<AdminUser> => {
    const { data } = await apiClient.patch<AuthMeResponse>("/auth/update-password", payload, {
      withCredentials: true,
    });
    return data.data.admin;
  },

  register: async (payload: RegisterAdminPayload): Promise<AdminUser> => {
    const { data } = await apiClient.post<AuthMeResponse>("/auth/register", payload, {
      withCredentials: true,
    });
    return data.data.admin;
  },
};
