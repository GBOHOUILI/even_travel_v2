const nf = new Intl.NumberFormat("fr-FR");
const pf = new Intl.NumberFormat("fr-FR", { style: "percent", maximumFractionDigits: 1 });

export interface RankedRow {
  label: string;
  count: number;
}

interface RankedListProps {
  rows: RankedRow[];
  tone: "indigo" | "saffron";
  suffix?: string;
}

export function RankedList({ rows, tone, suffix }: RankedListProps) {
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
              {suffix ? ` ${suffix}` : ""}
              <span className="an-ranked-share">
                {total > 0 ? pf.format(row.count / total) : "0 %"}
              </span>
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
