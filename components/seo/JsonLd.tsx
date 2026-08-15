/**
 * Injecte un bloc JSON-LD dans la page. Server Component pur (pas de
 * "use client") : le script est présent dans le HTML servi, lisible
 * immédiatement par Google sans exécution JS.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Sérialisation de données internes (jamais de HTML/contenu utilisateur
      // injecté ici) — dangerouslySetInnerHTML est le seul moyen documenté
      // par Next.js d'insérer du JSON-LD côté serveur.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
