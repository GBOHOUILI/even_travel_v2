"use client";

import { useRouter } from "next/navigation";

import { useLogout } from "@/features/auth/hooks/useLogout";
import type { AdminUser } from "@/types/admin";

interface AdminHeaderProps {
  user: AdminUser;
  onMenuToggle: () => void;
}

export function AdminHeader({ user, onMenuToggle }: AdminHeaderProps) {
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
        <div className="admin-nav-left">
          <button
            type="button"
            className="admin-mobile-menu-btn"
            onClick={onMenuToggle}
            aria-label="Ouvrir le menu"
          >
            <i className="fas fa-bars" aria-hidden="true" />
          </button>
          <div className="admin-logo">
            <span>Even</span>
            <span style={{ color: "var(--deep-brown)" }}>Travel</span>
          </div>
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
