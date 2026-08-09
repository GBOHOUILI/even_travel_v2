import Image from "next/image";

export function AboutIntro() {
  return (
    <section className="about-intro">
      <div className="container">
        <div className="about-intro-content">
          <span className="eyebrow">Qui sommes-nous</span>
          <h2>Bienvenue chez Even Travel</h2>
          <Image
            src="/images/sep-removebg-preview.png"
            alt=""
            aria-hidden="true"
            width={200}
            height={24}
            className="about-divider"
          />
        </div>
      </div>
    </section>
  );
}
