import Image from "next/image";

const ACTIVITIES = [
  {
    src: "/images/experience culinaire.gif",
    alt: "Plat traditionnel béninois préparé lors d'une expérience culinaire locale",
    title: "Expériences Culinaires Locale",
  },
  {
    src: "/images/culture.gif",
    alt: "Scène de danse et de tradition culturelle béninoise",
    title: "Culture & Traditions",
  },
  {
    src: "/images/aventure et exploration.gif",
    alt: "Excursion d'aventure et d'exploration en pleine nature au Bénin",
    title: "Aventure & Exploration",
  },
  {
    src: "/images/Nature et ecotourisme.gif",
    alt: "Paysage naturel préservé, écotourisme au Bénin",
    title: "Nature & Ecotourisme",
  },
];

export function Activities() {
  return (
    <section className="nos_activites">
      <div className="container">
        <h3 className="section-title">Des expériences comme nulle part ailleurs</h3>
        <div className="activities">
          {ACTIVITIES.map((activity) => (
            <div className="activity reveal" key={activity.title}>
              {/* unoptimized est nécessaire ici : ce sont des GIFs animés,
                  et le pipeline d'optimisation next/image ne préserve pas
                  l'animation des GIF (il les convertit en image statique).
                  Ce n'est pas un oubli — le retirer casserait l'animation. */}
              <Image src={activity.src} alt={activity.alt} width={280} height={200} unoptimized />
              <h3>{activity.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
