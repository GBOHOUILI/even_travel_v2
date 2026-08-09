import Image from "next/image";

export function AboutStory() {
  return (
    <section className="about-story">
      <div className="container">
        <div className="about-story-grid">
          <div className="about-story-text">
            <p>
              Nous sommes passionnés par l&apos;organisation de voyages uniques et attrayants en
              Afrique. Mais chez Even Travel, notre vision va bien au-delà du simple voyage.
            </p>
            <p>
              Nous avons une volonté profonde d&apos;instruire les enfants en ouvrant des écoles
              utilisant la méthode Montessori. Nous croyons que chaque enfant mérite une instruction
              optimale, où il peut développer ses compétences et sa créativité à son propre rythme.
            </p>
          </div>
          <div className="about-story-image">
            <Image src="/images/mme.jpg" alt="Notre équipe" width={400} height={400} />
          </div>
        </div>
      </div>
    </section>
  );
}
