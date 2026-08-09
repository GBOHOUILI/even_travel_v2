interface ValueItem {
  icon: string;
  title: string;
  description: string;
}

const VALUES: ValueItem[] = [
  {
    icon: "fa-heart",
    title: "Passion",
    description:
      "Nous sommes passionnés par l'Afrique et ses merveilles. Chaque voyage est une aventure unique.",
  },
  {
    icon: "fa-graduation-cap",
    title: "Éducation",
    description:
      "L'instruction des enfants est au cœur de notre mission avec la méthode Montessori.",
  },
  {
    icon: "fa-hands-helping",
    title: "Solidarité",
    description:
      "Nous soutenons les communautés locales et aidons les plus démunis à travers nos actions.",
  },
];

export function AboutValues() {
  return (
    <section className="about-values">
      <div className="container">
        <h2>Nos Valeurs</h2>
        <div className="about-values-grid">
          {VALUES.map((value) => (
            <div key={value.title} className="about-value-item">
              <div className="about-value-icon">
                <i className={`fas ${value.icon}`} aria-hidden="true" />
              </div>
              <h4>{value.title}</h4>
              <p>{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
