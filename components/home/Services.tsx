import Image from "next/image";

const CULINARY_EXPERIENCES = [
  { src: "/images/cul.jpg", alt: "Terre et Esprit", title: "Terre et Esprit", text: "Découverte des Egnguns à Ouidah" },
  {
    src: "/images/saveur_du_benin.jpg",
    alt: "Saveurs",
    title: "Saveurs du Bénin",
    text: "Atelier cuisine traditionnelle à Cotonou",
  },
  { src: "/images/artisanat.jpg", alt: "Artisanat", title: "Artisanat Vivant", text: "Rencontre avec des artisans à Abomey" },
];

const PACKAGES = [
  {
    src: "/images/pack famille.jpg",
    alt: "Pack family",
    title: "Pack family",
    text: "Un voyage pensé pour les familles, avec des moments de partage, de découverte et de complicité.",
  },
  {
    src: "/images/sejour sur mesure.jpg",
    alt: "Sur mesure",
    title: "Séjour sur mesure",
    text: "Vous rêvez d'un voyage unique, façonné selon vos envies ? Dites-nous qui vous êtes.",
  },
  {
    src: "/images/groupe.jpg",
    alt: "Groupes",
    title: "Séjour en groupes",
    text: "Rejoignez un petit groupe pour un circuit immersif, rythmé par la culture locale.",
  },
];

export function Services() {
  return (
    <section className="services-section">
      <div className="container">
        <h3 className="section-title" style={{ color: "var(--ochre)" }}>
          Nos Services
        </h3>
      </div>
      <div className="services">
        <div className="service-card fade-in">
          <h2>Nos séjours immersifs et Ateliers culinaires</h2>
          <div>
            {CULINARY_EXPERIENCES.map((item) => (
              <div key={item.title}>
                <Image src={item.src} alt={item.alt} width={280} height={200} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="service-card fade-in">
          <h2>Pack voyages</h2>
          <div>
            {PACKAGES.map((item) => (
              <div key={item.title}>
                <Image src={item.src} alt={item.alt} width={280} height={200} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
