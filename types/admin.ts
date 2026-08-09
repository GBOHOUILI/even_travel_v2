export type AdminRole = "admin" | "superadmin";

export interface AdminUser {
  _id: string;
  nom: string;
  email: string;
  role: AdminRole;
  createdAt?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Le backend (authController.js) répond systématiquement avec la clé
 * `admin`, pas `user` — sur /auth/login, /auth/register, /auth/me et
 * /auth/update-me. Confirmé sur even-travel-backend-v2.
 */
export interface AuthMeResponse {
  status: string;
  data: {
    admin: AdminUser;
  };
}

export interface UpdateMePayload {
  nom?: string;
  email?: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

/** Pas de rôle/passwordConfirm côté backend — cf. registerAdminSchema
 * (nom, email, password uniquement). */
export interface RegisterAdminPayload {
  nom: string;
  email: string;
  password: string;
}
