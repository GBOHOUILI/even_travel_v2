import type { ReactNode } from "react";

export function LegalPage({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt: string;
  children: ReactNode;
}) {
  return (
    <main className="legal-page">
      <div className="legal-page__inner">
        <h1>{title}</h1>
        <p className="legal-page__updated">Dernière mise à jour : {updatedAt}</p>
        {children}
      </div>
    </main>
  );
}
