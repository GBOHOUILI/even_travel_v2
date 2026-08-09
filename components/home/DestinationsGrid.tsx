import Image from "next/image";

const DESTINATIONS = [
  { src: "/images/Benin.jpg", alt: "Bénin", title: "Bénin" },
  { src: "/images/togo.jpg", alt: "Togo", title: "Togo" },
  { src: "/images/ghana.jpg", alt: "Ghana", title: "Ghana" },
  { src: "/images/maroc.jpg", alt: "Maroc", title: "Maroc" },
  { src: "/images/tunisie.jpg", alt: "Tunisie", title: "Tunisie" },
];

export function DestinationsGrid() {
  return (
    <section className="destinations-section">
      <div className="container">
        <h2>Nos destinations</h2>
        <p className="subtitle">5 pays, une infinité d&apos;émotions.</p>
        <div className="dest-list">
          {DESTINATIONS.map((dest) => (
            <div className="dest-item" key={dest.title}>
              <Image src={dest.src} alt={dest.alt} width={220} height={280} />
              <h4>{dest.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
