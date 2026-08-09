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

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <aside className="admin-sidebar">
      <ul className="admin-sidebar-menu">
        {ADMIN_NAV_LINKS.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={isActive(link.href) ? "active" : ""}>
              <i className={`fas ${link.icon}`} aria-hidden="true" /> {link.label}
            </Link>
          </li>
        ))}
        <li className="admin-sidebar-settings">
          <Link href="/admin/settings" className={isActive("/admin/settings") ? "active" : ""}>
            <i className="fas fa-cog" aria-hidden="true" /> Paramètres du compte
          </Link>
        </li>
      </ul>
    </aside>
  );
}
