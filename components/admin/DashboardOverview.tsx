"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { RankedList } from "@/components/admin/RankedList";
import type { ReservationStatus } from "@/features/dashboard/api/dashboard.types";
import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";

const PERIODS = [
  { days: 7, label: "7 jours" },
  { days: 30, label: "30 jours" },
  { days: 90, label: "90 jours" },
] as const;

type Metric = "revenue" | "reservations";

const METRIC_TABS: { key: Metric; label: string }[] = [
  { key: "revenue", label: "Revenus" },
  { key: "reservations", label: "Réservations" },
];

// recharts n'accepte pas les var() CSS dans les props SVG, d'où les hex
const SAFFRON = "#e8a33d";
const NIGHT = "#1d2160";

const STATUS_META: Record<ReservationStatus, { label: string; badge: string; color: string }> = {
  paye: { label: "Payées", badge: "Payée", color: "#0f8b8d" },
  acompte: { label: "Acompte versé", badge: "Acompte", color: "#2f3a8f" },
  en_attente: { label: "En attente", badge: "En attente", color: "#e8a33d" },
  annule: { label: "Annulées", badge: "Annulée", color: "#c8553d" },
};

const METHOD_LABELS: Record<string, string> = {
  carte: "Carte bancaire",
  mtn: "MTN MoMo",
  moov: "Moov Money",
  autre: "Autre",
};

const nf = new Intl.NumberFormat("fr-FR");
const pf = new Intl.NumberFormat("fr-FR", { style: "percent", maximumFractionDigits: 1 });
const deltaFormat = new Intl.NumberFormat("fr-FR", {
  style: "percent",
  maximumFractionDigits: 0,
  signDisplay: "exceptZero",
});

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function formatLongDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function Delta({ current, previous }: { current: number; previous: number }) {
  if (previous === 0) {
    return current > 0 ? <span className="an-delta an-delta--up">Nouveau</span> : null;
  }
  const change = (current - previous) / previous;
  const tone = change > 0 ? "up" : change < 0 ? "down" : "flat";
  return <span className={`an-delta an-delta--${tone}`}>{deltaFormat.format(change)}</span>;
}

type ChartTooltipProps = {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string | number;
  unit: string;
};

function ChartTooltip({ active, payload, label, unit }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="an-tooltip">
      <div className="an-tooltip-date">{formatLongDate(String(label))}</div>
      <div className="an-tooltip-value">
        {nf.format(payload[0]?.value ?? 0)} <span>{unit}</span>
      </div>
    </div>
  );
}

function Skeleton({ height }: { height: number }) {
  return <div className="an-skeleton" style={{ height }} aria-hidden="true" />;
}

export function DashboardOverview() {
  const [days, setDays] = useState<number>(30);
  const [metric, setMetric] = useState<Metric>("revenue");
  const { data, isLoading, isError, refetch } = useDashboardStats(days);

  const totals = data?.totals;
  const previous = data?.previous;
  const statuses = data?.reservationsByStatus ?? [];
  const statusTotal = statuses.reduce((sum, s) => sum + s.count, 0);
  const paidCount = statuses.find((s) => s.status === "paye")?.count ?? 0;
  const unit = metric === "revenue" ? "FCFA" : "réservations";

  return (
    <section className="an-page">
      <div className="admin-section-header an-header">
        <h1 className="admin-section-title">Tableau de Bord</h1>
        <div className="an-segmented" role="group" aria-label="Période">
          {PERIODS.map((p) => (
            <button
              key={p.days}
              type="button"
              className="an-segmented-btn"
              aria-pressed={days === p.days}
              onClick={() => setDays(p.days)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {isError ? (
        <div className="an-card">
          <p className="an-empty">Impossible de charger les statistiques.</p>
          <div className="an-retry">
            <button type="button" className="an-segmented-btn" onClick={() => refetch()}>
              Réessayer
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="an-kpis">
            <div className="an-kpi">
              <div className="an-kpi-top">
                <div className="an-kpi-icon an-kpi-icon--saffron">
                  <i className="fas fa-money-bill-wave" aria-hidden="true" />
                </div>
                {totals && previous && (
                  <Delta current={totals.revenue} previous={previous.revenue} />
                )}
              </div>
              <div className="an-kpi-number">
                {isLoading ? "…" : nf.format(totals?.revenue ?? 0)}
              </div>
              <div className="an-kpi-label">Revenus (FCFA)</div>
              <div className="an-kpi-hint">Paiements confirmés sur {days} jours</div>
            </div>

            <div className="an-kpi">
              <div className="an-kpi-top">
                <div className="an-kpi-icon an-kpi-icon--indigo">
                  <i className="fas fa-ticket-alt" aria-hidden="true" />
                </div>
                {totals && previous && (
                  <Delta current={totals.reservations} previous={previous.reservations} />
                )}
              </div>
              <div className="an-kpi-number">
                {isLoading ? "…" : nf.format(totals?.reservations ?? 0)}
              </div>
              <div className="an-kpi-label">Réservations</div>
              <div className="an-kpi-hint">Par rapport aux {days} jours précédents</div>
            </div>

            <div className="an-kpi">
              <div className="an-kpi-top">
                <div className="an-kpi-icon an-kpi-icon--teal">
                  <i className="fas fa-check-circle" aria-hidden="true" />
                </div>
              </div>
              <div className="an-kpi-number">
                {isLoading ? "…" : statusTotal > 0 ? pf.format(paidCount / statusTotal) : "0 %"}
              </div>
              <div className="an-kpi-label">Taux de paiement</div>
              <div className="an-kpi-hint">
                {isLoading
                  ? "\u00a0"
                  : `${nf.format(paidCount)} payées sur ${nf.format(statusTotal)}`}
              </div>
            </div>

            <div className="an-kpi">
              <div className="an-kpi-top">
                <div className="an-kpi-icon an-kpi-icon--coral">
                  <i className="fas fa-comment-dots" aria-hidden="true" />
                </div>
              </div>
              <div className="an-kpi-number">
                {isLoading ? "…" : nf.format(totals?.pendingComments ?? 0)}
              </div>
              <div className="an-kpi-label">Commentaires à modérer</div>
              <div className="an-kpi-hint">
                <Link href="/admin/comments" className="an-link">
                  Ouvrir la modération
                </Link>
              </div>
            </div>
          </div>

          <div className="an-hero">
            <div className="an-hero-head">
              <div>
                <h2 className="an-hero-title">
                  {metric === "revenue" ? "Revenus par jour" : "Réservations par jour"}
                </h2>
                <p className="an-hero-sub">Sur les {days} derniers jours</p>
              </div>
              <div className="an-segmented an-segmented--dark" role="group" aria-label="Indicateur">
                {METRIC_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    className="an-segmented-btn"
                    aria-pressed={metric === tab.key}
                    onClick={() => setMetric(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            {isLoading ? (
              <Skeleton height={300} />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={data?.daily ?? []}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="dashFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={SAFFRON} stopOpacity={0.5} />
                      <stop offset="100%" stopColor={SAFFRON} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke="rgba(255,255,255,0.08)"
                    strokeDasharray="2 6"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatShortDate}
                    tick={{ fontSize: 12, fill: "rgba(255,255,255,0.6)" }}
                    axisLine={false}
                    tickLine={false}
                    tickMargin={12}
                    minTickGap={40}
                  />
                  <YAxis
                    allowDecimals={false}
                    width={metric === "revenue" ? 56 : 36}
                    tickFormatter={(v: number) =>
                      metric === "revenue" && v >= 1000 ? `${nf.format(v / 1000)}k` : String(v)
                    }
                    tick={{ fontSize: 12, fill: "rgba(255,255,255,0.6)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={<ChartTooltip unit={unit} />}
                    cursor={{ stroke: "rgba(255,255,255,0.25)", strokeDasharray: "3 3" }}
                  />
                  <Area
                    type="monotone"
                    dataKey={metric}
                    stroke={SAFFRON}
                    strokeWidth={2.5}
                    fill="url(#dashFill)"
                    activeDot={{ r: 6, fill: SAFFRON, stroke: NIGHT, strokeWidth: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="an-grid-2">
            <div className="an-card">
              <h2 className="an-card-title">Réservations par statut</h2>
              {isLoading ? (
                <Skeleton height={200} />
              ) : statusTotal === 0 ? (
                <p className="an-empty">Aucune réservation sur cette période.</p>
              ) : (
                <div className="an-donut">
                  <div className="an-donut-chart">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={statuses}
                          dataKey="count"
                          nameKey="status"
                          innerRadius={62}
                          outerRadius={90}
                          paddingAngle={3}
                          cornerRadius={5}
                          stroke="none"
                        >
                          {statuses.map((s) => (
                            <Cell key={s.status} fill={STATUS_META[s.status].color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="an-donut-center" aria-hidden="true">
                      <div className="an-donut-total">{nf.format(statusTotal)}</div>
                      <div className="an-donut-caption">réservations</div>
                    </div>
                  </div>
                  <ul className="an-legend">
                    {statuses.map((s) => (
                      <li key={s.status} className="an-legend-row">
                        <span
                          className="an-legend-dot"
                          style={{ background: STATUS_META[s.status].color }}
                        />
                        <span className="an-legend-name">{STATUS_META[s.status].label}</span>
                        <span className="an-legend-count">{nf.format(s.count)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="an-card">
              <h2 className="an-card-title">Paiements par moyen</h2>
              {isLoading ? (
                <Skeleton height={200} />
              ) : (data?.paymentsByMethod.length ?? 0) === 0 ? (
                <p className="an-empty">Aucun paiement confirmé sur cette période.</p>
              ) : (
                <RankedList
                  rows={(data?.paymentsByMethod ?? []).map((m) => ({
                    label: METHOD_LABELS[m.method] ?? m.method,
                    count: m.amount,
                  }))}
                  tone="saffron"
                  suffix="FCFA"
                />
              )}
            </div>
          </div>

          <div className="an-grid-2">
            <div className="an-card">
              <div className="an-card-head">
                <h2 className="an-card-title">Destinations les plus réservées</h2>
              </div>
              {isLoading ? (
                <Skeleton height={200} />
              ) : (data?.topDestinations.length ?? 0) === 0 ? (
                <p className="an-empty">Aucune réservation sur cette période.</p>
              ) : (
                <RankedList
                  rows={(data?.topDestinations ?? []).map((d) => ({
                    label: d.title,
                    count: d.count,
                  }))}
                  tone="indigo"
                  suffix="rés."
                />
              )}
            </div>

            <div className="an-card">
              <div className="an-card-head">
                <h2 className="an-card-title">Événements les plus réservés</h2>
                {!isLoading && (
                  <Link href="/admin/events" className="an-link">
                    {nf.format(totals?.upcomingEvents ?? 0)} à venir
                  </Link>
                )}
              </div>
              {isLoading ? (
                <Skeleton height={200} />
              ) : (data?.topEvents.length ?? 0) === 0 ? (
                <p className="an-empty">Aucune réservation sur cette période.</p>
              ) : (
                <RankedList
                  rows={(data?.topEvents ?? []).map((e) => ({ label: e.title, count: e.count }))}
                  tone="indigo"
                  suffix="rés."
                />
              )}
            </div>
          </div>

          <div className="an-card">
            <div className="an-card-head">
              <h2 className="an-card-title">Dernières réservations</h2>
              <Link href="/admin/reservations" className="an-link">
                Tout voir
              </Link>
            </div>
            {isLoading ? (
              <Skeleton height={220} />
            ) : (data?.recentReservations.length ?? 0) === 0 ? (
              <p className="an-empty">Aucune réservation pour le moment.</p>
            ) : (
              <div className="an-table-wrap">
                <table className="an-table">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Réservation</th>
                      <th className="an-table-num">Montant</th>
                      <th>Statut</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.recentReservations ?? []).map((r) => {
                      const partial = r.montantPaye > 0 && r.montantPaye < r.montantTotal;
                      return (
                        <tr key={r.id}>
                          <td className="an-table-strong">{r.client}</td>
                          <td>
                            {r.title}
                            <span className="an-table-sub">
                              {r.places} place{r.places > 1 ? "s" : ""}
                            </span>
                          </td>
                          <td className="an-table-num">
                            {nf.format(r.montantTotal)} FCFA
                            {partial && (
                              <span className="an-table-sub">{nf.format(r.montantPaye)} payés</span>
                            )}
                          </td>
                          <td>
                            <span className={`an-badge an-badge--${r.statutPaiement}`}>
                              {STATUS_META[r.statutPaiement].badge}
                            </span>
                          </td>
                          <td>{formatShortDate(r.createdAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
