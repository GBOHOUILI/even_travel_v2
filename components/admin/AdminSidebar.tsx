"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_NAV_LINKS = [
  { href: "/admin", label: "Tableau de Bord", icon: "fa-chart-line" },
  { href: "/admin/events", label: "Événements", icon: "fa-calendar-alt" },
  { href: "/admin/destinations", label: "Destinations", icon: "fa-map-marked-alt" },
  { href: "/admin/blogs", label: "Articles", icon: "fa-blog" },
  { href: "/admin/comments", label: "Commentaires", icon: "fa-comments" },
  { href: "/admin/payments", label: "Paiements", icon: "fa-credit-card" },
  { href: "/admin/reservations", label: "Réservations", icon: "fa-calendar-check" },
] as const;

interface AdminSidebarProps {
  /** Tiroir ouvert sur mobile/tablette (<1024px) — sans effet en desktop. */
  open: boolean;
  onClose: () => void;
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <>
      {/* Fond assombri, cliquable pour fermer — visible seulement quand le tiroir est ouvert (mobile/tablette). */}
      {open && <div className="admin-sidebar-backdrop" onClick={onClose} role="presentation" />}
      <aside className={`admin-sidebar ${open ? "admin-sidebar--open" : ""}`}>
        <div className="admin-sidebar-mobile-header">
          <span className="admin-logo">
            <span>Even</span>
            <span style={{ color: "var(--deep-brown)" }}>Travel</span>
          </span>
          <button
            type="button"
            className="admin-close-btn"
            onClick={onClose}
            aria-label="Fermer le menu"
          >
            ×
          </button>
        </div>
        <ul className="admin-sidebar-menu">
          {ADMIN_NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={isActive(link.href) ? "active" : ""}
                onClick={onClose}
              >
                <i className={`fas ${link.icon}`} aria-hidden="true" /> {link.label}
              </Link>
            </li>
          ))}
          <li className="admin-sidebar-settings">
            <Link
              href="/admin/settings"
              className={isActive("/admin/settings") ? "active" : ""}
              onClick={onClose}
            >
              <i className="fas fa-cog" aria-hidden="true" /> Paramètres du compte
            </Link>
          </li>
        </ul>
      </aside>
    </>
  );
}
