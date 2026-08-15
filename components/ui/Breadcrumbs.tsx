import Link from "next/link";

export interface BreadcrumbLink {
  label: string;
  href?: string;
}

/**
 * Fil d'Ariane textuel simple, cohérent avec le design existant (pas de
 * dépendance à une nouvelle librairie). Le dernier élément (page courante)
 * n'est pas un lien, conformément aux bonnes pratiques d'accessibilité et
 * au schema BreadcrumbList associé (voir lib/structuredData.ts).
 */
export function Breadcrumbs({ items }: { items: BreadcrumbLink[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Fil d'Ariane">
      <ol>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label}>
              {item.href && !isLast ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined}>{item.label}</span>
              )}
              {!isLast && (
                <span className="breadcrumbs__separator" aria-hidden="true">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
