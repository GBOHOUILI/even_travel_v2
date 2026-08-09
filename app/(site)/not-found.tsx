import Link from "next/link";

export default function NotFound() {
  return (
    <div className="empty-state" style={{ padding: "var(--spacing-xl) 0" }}>
      <h2>Page introuvable</h2>
      <p>La page que vous recherchez n&apos;existe pas ou a été déplacée.</p>
      <Link href="/">
        <button className="btn-primary">Retour à l&apos;accueil</button>
      </Link>
    </div>
  );
}
