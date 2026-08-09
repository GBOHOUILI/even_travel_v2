"use client";

import type { DashboardStats } from "@/features/dashboard/api/dashboard.types";
import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";

interface StatCardDef {
  key: keyof DashboardStats;
  icon: string;
  label: string;
  format?: (value: number) => string;
}

const STAT_CARDS: StatCardDef[] = [
  { key: "totalReservations", icon: "fa-ticket-alt", label: "Réservations" },
  { key: "totalEvents", icon: "fa-calendar-check", label: "Événements Actifs" },
  { key: "totalDestinations", icon: "fa-globe-africa", label: "Destinations" },
  { key: "totalComments", icon: "fa-comment-dots", label: "Commentaires" },
  {
    key: "totalRevenue",
    icon: "fa-money-bill-wave",
    label: "Revenus (FCFA)",
    format: (value) => value.toLocaleString("fr-FR"),
  },
];

export function DashboardStatsGrid() {
  const { data, isLoading } = useDashboardStats();

  return (
    <div className="admin-stats-grid">
      {STAT_CARDS.map((card) => {
        const rawValue = data ? data[card.key] : null;
        const display = isLoading
          ? "…"
          : rawValue === null || rawValue === undefined
            ? "—"
            : (card.format ?? String)(rawValue);

        return (
          <div key={card.key} className="admin-stat-card">
            <div className="admin-stat-icon">
              <i className={`fas ${card.icon}`} aria-hidden="true" />
            </div>
            <div className="admin-stat-number">{display}</div>
            <div className="admin-stat-label">{card.label}</div>
          </div>
        );
      })}
    </div>
  );
}
