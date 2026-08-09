const VALUE_PROPS = [
  {
    icon: "❤️",
    title: "Authenticité et Culture",
    text: "Guides locaux, rencontres et ateliers pour comprendre les territoires.",
  },
  {
    icon: "🎓",
    title: "Accompagnement",
    text: "Assistance Whatsapp, brief avant départ, sélection d'hébergement vérifiés.",
  },
  {
    icon: "🤝",
    title: "Responsabilité",
    text: "Itinéraires et partenaires valorisant l'économie locale et l'environnement.",
  },
  {
    icon: "💳",
    title: "Paiement Flexible",
    text: "Paiement en 2 fois disponible. Paiement 100% sécurisé",
  },
];

export function ValueProps() {
  return (
    <section className="value-props">
      <div className="container">
        {VALUE_PROPS.map((item) => (
          <div className="item" key={item.title}>
            <div className="icon-placeholder">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
