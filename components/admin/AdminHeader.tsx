"use client";

import { useRouter } from "next/navigation";

import { useLogout } from "@/features/auth/hooks/useLogout";
import type { AdminUser } from "@/types/admin";

export function AdminHeader({ user }: { user: AdminUser }) {
  const router = useRouter();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => {
        router.replace("/admin/login");
      },
    });
  };

  return (
    <header className="admin-header">
      <nav className="admin-nav">
        <div className="admin-logo">
          <span>Even</span>
          <span style={{ color: "var(--deep-brown)" }}>Travel</span>
        </div>
        <div className="admin-actions">
          <span>{user.nom || user.email}</span>
          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
            disabled={logout.isPending}
          >
            <i className="fas fa-sign-out-alt" aria-hidden="true" /> Déconnexion
          </button>
        </div>
      </nav>
    </header>
  );
}
