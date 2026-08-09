import Image from "next/image";
import Link from "next/link";

export function Intro() {
  return (
    <section className="intro">
      <div className="container">
        <div>
          <span className="eyebrow">Découvrir l&apos;Afrique autrement</span>
          <h3>Voyager autrement. Vivre l&apos;Afrique, pas seulement la visiter.</h3>
          <p>
            Agence de tourisme basée à Cotonou. Voyages sur mesure, écotourisme, circuits
            culturels et expériences authentiques. Assistance locale et organisation
            professionnelle.
          </p>
          <p style={{ marginTop: 24 }}>
            <Link href="/contact">
              <button className="btn-primary">Planifier mon voyage</button>
            </Link>
            <Link href="/destinations">
              <button className="btn-secondary" style={{ marginLeft: 12 }}>
                Voir nos destinations
              </button>
            </Link>
          </p>
        </div>
        <aside>
          <div className="grid-images">
            <Image
              className="img-zoom"
              src="/images/mur du port.jpg"
              alt="murales"
              width={280}
              height={280}
            />
            <Image
              className="img-zoom"
              src="/images/ouidah.jpg"
              alt="porte"
              width={280}
              height={280}
            />
          </div>
          <div style={{ marginTop: 16 }} className="grid-images">
            <Image
              className="img-zoom"
              src="/images/amazone.jpg"
              alt="statue"
              width={280}
              height={280}
            />
            <Image
              className="img-zoom"
              src="/images/femmes rurales.jpg"
              alt="femme"
              width={280}
              height={280}
            />
          </div>
        </aside>
      </div>
    </section>
  );
}
