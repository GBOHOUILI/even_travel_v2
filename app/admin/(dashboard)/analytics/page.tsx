"use client";

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

import { useAnalyticsStats } from "@/features/analytics/hooks/useAnalyticsStats";

const PERIODS = [
  { days: 7, label: "7 jours" },
  { days: 30, label: "30 jours" },
  { days: 90, label: "90 jours" },
] as const;

// recharts n'accepte pas les var() CSS dans les props SVG, d'où les hex
const SAFFRON = "#e8a33d";
const NIGHT = "#1d2160";
const DONUT_COLORS = ["#2f3a8f", "#e8a33d", "#0f8b8d", "#c8553d", "#7a6fd0"];

const nf = new Intl.NumberFormat("fr-FR");
const pf = new Intl.NumberFormat("fr-FR", { style: "percent", maximumFractionDigits: 1 });

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

function prettyPath(path: string): string {
  return path === "/" ? "Accueil" : path;
}

function prettyReferrer(referrer: string): string {
  return referrer
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");
}

function ratio(part: number, whole: number): string {
  return whole > 0 ? pf.format(part / whole) : "0 %";
}

type RankedRow = { label: string; count: number };

function RankedList({ rows, tone }: { rows: RankedRow[]; tone: "indigo" | "saffron" }) {
  const max = Math.max(...rows.map((r) => r.count), 1);
  const total = rows.reduce((sum, r) => sum + r.count, 0);

  return (
    <ul className="an-ranked">
      {rows.map((row) => (
        <li key={row.label} className="an-ranked-row">
          <div className="an-ranked-head">
            <span className="an-ranked-label" title={row.label}>
              {row.label}
            </span>
            <span className="an-ranked-count">
              {nf.format(row.count)}
              <span className="an-ranked-share">{ratio(row.count, total)}</span>
            </span>
          </div>
          <div className="an-ranked-track">
            <div
              className={`an-ranked-fill an-ranked-fill--${tone}`}
              style={{ width: `${(row.count / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

type ViewsTooltipProps = {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string | number;
};

function ViewsTooltip({ active, payload, label }: ViewsTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="an-tooltip">
      <div className="an-tooltip-date">{formatLongDate(String(label))}</div>
      <div className="an-tooltip-value">
        {nf.format(payload[0]?.value ?? 0)} <span>vues</span>
      </div>
    </div>
  );
}

function Skeleton({ height }: { height: number }) {
  return <div className="an-skeleton" style={{ height }} aria-hidden="true" />;
}

export default function AdminAnalyticsPage() {
  const [days, setDays] = useState<number>(30);
  const { data, isLoading } = useAnalyticsStats(days);

  const daily = data?.dailyPageViews ?? [];
  const totalViews = data?.totalPageViews ?? 0;
  const whatsapp = data?.totalWhatsappClicks ?? 0;
  const forms = data?.totalFormSubmits ?? 0;

  const peak = daily.reduce<{ date: string; count: number } | null>(
    (best, d) => (best === null || d.count > best.count ? d : best),
    null,
  );

  const topPages: RankedRow[] = (data?.topPages ?? []).map((p) => ({
    label: prettyPath(p.path),
    count: p.count,
  }));
  const referrers: RankedRow[] = (data?.topReferrers ?? []).map((r) => ({
    label: prettyReferrer(r.referrer),
    count: r.count,
  }));
  const formsByType = data?.formSubmitsByForm ?? [];
  const formsTotal = formsByType.reduce((sum, f) => sum + f.count, 0);

  return (
    <section className="an-page">
      <div className="admin-section-header an-header">
        <h1 className="admin-section-title">Analytique</h1>
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

      <div className="an-kpis">
        <div className="an-kpi">
          <div className="an-kpi-icon an-kpi-icon--indigo">
            <i className="fas fa-eye" aria-hidden="true" />
          </div>
          <div className="an-kpi-number">{isLoading ? "…" : nf.format(totalViews)}</div>
          <div className="an-kpi-label">Vues de page ({days}j)</div>
          <div className="an-kpi-hint">
            {isLoading
              ? "\u00a0"
              : `${nf.format(Math.round(totalViews / days))} par jour en moyenne`}
          </div>
        </div>
        <div className="an-kpi">
          <div className="an-kpi-icon an-kpi-icon--teal">
            <i className="fab fa-whatsapp" aria-hidden="true" />
          </div>
          <div className="an-kpi-number">{isLoading ? "…" : nf.format(whatsapp)}</div>
          <div className="an-kpi-label">Clics WhatsApp ({days}j)</div>
          <div className="an-kpi-hint">
            {isLoading ? "\u00a0" : `${ratio(whatsapp, totalViews)} des vues`}
          </div>
        </div>
        <div className="an-kpi">
          <div className="an-kpi-icon an-kpi-icon--saffron">
            <i className="fas fa-paper-plane" aria-hidden="true" />
          </div>
          <div className="an-kpi-number">{isLoading ? "…" : nf.format(forms)}</div>
          <div className="an-kpi-label">Formulaires soumis ({days}j)</div>
          <div className="an-kpi-hint">
            {isLoading ? "\u00a0" : `${ratio(forms, totalViews)} des vues`}
          </div>
        </div>
      </div>

      <div className="an-hero">
        <div className="an-hero-head">
          <div>
            <h2 className="an-hero-title">Vues de page</h2>
            <p className="an-hero-sub">Sur les {days} derniers jours</p>
          </div>
          {peak && peak.count > 0 && (
            <div className="an-hero-peak">
              <div className="an-hero-peak-number">{nf.format(peak.count)}</div>
              <div className="an-hero-peak-label">
                meilleur jour, le {formatShortDate(peak.date)}
              </div>
            </div>
          )}
        </div>
        {isLoading ? (
          <Skeleton height={300} />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={daily} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="anViewsFill" x1="0" y1="0" x2="0" y2="1">
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
                width={36}
                tick={{ fontSize: 12, fill: "rgba(255,255,255,0.6)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<ViewsTooltip />}
                cursor={{ stroke: "rgba(255,255,255,0.25)", strokeDasharray: "3 3" }}
              />
              <Area
                type="monotone"
                dataKey="count"
                name="Vues"
                stroke={SAFFRON}
                strokeWidth={2.5}
                fill="url(#anViewsFill)"
                activeDot={{ r: 6, fill: SAFFRON, stroke: NIGHT, strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="an-grid-2">
        <div className="an-card">
          <h2 className="an-card-title">Pages les plus consultées</h2>
          {isLoading ? (
            <Skeleton height={200} />
          ) : topPages.length === 0 ? (
            <p className="an-empty">Aucune donnée pour le moment.</p>
          ) : (
            <RankedList rows={topPages} tone="indigo" />
          )}
        </div>

        <div className="an-card">
          <h2 className="an-card-title">Sources de trafic externes</h2>
          {isLoading ? (
            <Skeleton height={200} />
          ) : referrers.length === 0 ? (
            <p className="an-empty">
              Aucune donnée pour le moment. Les accès directs ne sont pas comptés ici.
            </p>
          ) : (
            <RankedList rows={referrers} tone="saffron" />
          )}
        </div>
      </div>

      <div className="an-card">
        <h2 className="an-card-title">Formulaires soumis par type</h2>
        {isLoading ? (
          <Skeleton height={180} />
        ) : formsByType.length === 0 ? (
          <p className="an-empty">Aucune donnée pour le moment.</p>
        ) : (
          <div className="an-donut">
            <div className="an-donut-chart">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={formsByType}
                    dataKey="count"
                    nameKey="formName"
                    innerRadius={62}
                    outerRadius={90}
                    paddingAngle={3}
                    cornerRadius={5}
                    stroke="none"
                  >
                    {formsByType.map((f, i) => (
                      <Cell key={f.formName} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="an-donut-center" aria-hidden="true">
                <div className="an-donut-total">{nf.format(formsTotal)}</div>
                <div className="an-donut-caption">soumissions</div>
              </div>
            </div>
            <ul className="an-legend">
              {formsByType.map((f, i) => (
                <li key={f.formName} className="an-legend-row">
                  <span
                    className="an-legend-dot"
                    style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}
                  />
                  <span className="an-legend-name">{f.formName}</span>
                  <span className="an-legend-count">
                    {nf.format(f.count)}
                    <span className="an-ranked-share">{ratio(f.count, formsTotal)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
