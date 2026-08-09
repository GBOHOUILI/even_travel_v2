import "server-only";

import { cookies } from "next/headers";

import { API_BASE_URL } from "@/constants/config";
import type { AdminUser, AuthMeResponse } from "@/types/admin";

/**
 * ⚠️ INUTILISÉE ACTUELLEMENT — ne peut pas fonctionner tant que le
 * frontend et le backend sont sur des domaines différents.
 *
 * Le cookie `jwt` est posé par le backend sur son propre domaine
 * (even-travel-backend.onrender.com). `cookies()` de next/headers ne
 * lit que les cookies envoyés AU SERVEUR NEXT.JS par le navigateur —
 * jamais un cookie tiers appartenant à un autre domaine. `cookieHeader`
 * sera donc toujours vide ici, quoi qu'on fasse côté `sameSite`/
 * `secure`. Le garde-fou réel vit dans
 * `components/admin/AdminAuthGuard.tsx` (appel client direct au
 * backend, où le cookie circule normalement).
 *
 * À réactiver seulement si les appels API sont un jour proxifiés à
 * travers le domaine du frontend (rewrites Next.js) — le cookie
 * deviendrait alors first-party et visible ici.
 */
export async function getServerAdmin(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  if (!cookieHeader) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data: AuthMeResponse = await res.json();
    return data.data.admin;
  } catch {
    return null;
  }
}
