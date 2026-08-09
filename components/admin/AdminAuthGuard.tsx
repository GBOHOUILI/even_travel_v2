"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAdminMe } from "@/features/auth/hooks/useAdminMe";

/**
 * Garde-fou des routes /admin/(dashboard)/**.
 *
 * ⚠️ Pourquoi côté client et pas côté serveur : le cookie de session
 * `jwt` est posé par le backend sur son propre domaine
 * (even-travel-backend.onrender.com), pas sur celui du frontend. Un
 * navigateur n'envoie un cookie qu'au domaine qui l'a posé — jamais au
 * serveur Next.js lui-même. `middleware.ts` (request.cookies) et
 * l'ancien `getServerAdmin()` (cookies() de next/headers) ne peuvent
 * donc JAMAIS voir ce cookie, quel que soit son nom ou son
 * `sameSite` : ils lisent les cookies reçus par le serveur Next, pas
 * ceux détenus par le navigateur pour le domaine du backend.
 *
 * Le seul endroit où le cookie circule correctement est un appel direct
 * navigateur → backend (ce que fait `apiClient` avec
 * `withCredentials: true`) — d'où ce garde-fou en Client Component,
 * via `useAdminMe()`.
 *
 * Fix propre à terme : proxifier les appels API à travers le domaine du
 * frontend (rewrites Next.js) pour que le cookie devienne first-party —
 * alors le contrôle serveur (middleware + Server Component) redeviendra
 * possible et plus robuste que ce garde-fou client.
 */
export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: admin, isLoading, isError } = useAdminMe();

  useEffect(() => {
    if (!isLoading && (isError || !admin)) {
      const loginUrl = `/admin/login?from=${encodeURIComponent(pathname)}`;
      router.replace(loginUrl);
    }
  }, [isLoading, isError, admin, pathname, router]);

  if (isLoading) {
    return (
      <div className="admin-auth-loading">
        <p>Vérification de la session...</p>
      </div>
    );
  }

  if (!admin) {
    // En cours de redirection (effet ci-dessus) — rien à afficher.
    return null;
  }

  return (
    <>
      <AdminHeader user={admin} />
      <div className="admin-container">
        <AdminSidebar />
        <main className="admin-main-content">{children}</main>
      </div>
    </>
  );
}
