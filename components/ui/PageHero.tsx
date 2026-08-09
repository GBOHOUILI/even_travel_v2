import type { ReactNode } from "react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  children?: ReactNode;
}

/**
 * Variante compacte du Hero de la page d'accueil, utilisée sur les pages
 * internes (destinations, événements, blog...). Le style est défini par
 * `.page-hero*` dans globals.css.
 */
export function PageHero({ title, subtitle, backgroundImage, children }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="page-hero__bg" style={{ backgroundImage: `url(${backgroundImage})` }} />
      <div className="page-hero__overlay">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
