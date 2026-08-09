import Link from "next/link";

export function CtaSection() {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta">
          <div>
            <h2>Prêts pour l&apos;aventure ?</h2>
            <p>Décrivez-nous votre projet, on s&apos;occupe du reste. Réponse sous 24h.</p>
          </div>
          <Link href="/contact">
            <button>Nous écrire</button>
          </Link>
        </div>
      </div>
    </section>
  );
}
