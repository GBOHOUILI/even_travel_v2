import Link from "next/link";

import { EmptyState } from "@/components/ui/EmptyState";

export default function NotFound() {
  return (
    <EmptyState
      className="empty-state-page"
      message={
        <>
          <h2>Page introuvable</h2>
          <p>La page que vous recherchez n&apos;existe pas ou a été déplacée.</p>
        </>
      }
      action={
        <Link href="/">
          <button className="btn-primary">Retour à l&apos;accueil</button>
        </Link>
      }
    />
  );
}
