import Image from "next/image";

const ACTIVITIES = [
  { src: "/images/experience culinaire.gif", alt: "Expériences Culinaires", title: "Expériences Culinaires Locale" },
  { src: "/images/culture.gif", alt: "Culture", title: "Culture & Traditions" },
  { src: "/images/aventure et exploration.gif", alt: "Aventure", title: "Aventure & Exploration" },
  { src: "/images/Nature et ecotourisme.gif", alt: "Nature", title: "Nature & Ecotourisme" },
];

export function Activities() {
  return (
    <section className="nos_activites">
      <div className="container">
        <h3 className="section-title">Des expériences comme nulle part ailleurs</h3>
        <div className="activities">
          {ACTIVITIES.map((activity) => (
            <div className="activity reveal" key={activity.title}>
              <Image src={activity.src} alt={activity.alt} width={280} height={200} unoptimized />
              <h3>{activity.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
