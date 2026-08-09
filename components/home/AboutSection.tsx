"use client";

import Image from "next/image";
import { useState } from "react";

export function AboutSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="about-section">
      <div className="container">
        <div className="about">
          <div className="text">
            <Image
              className="about-logo"
              src="/images/logo-01.png"
              alt="Logo Even Travel"
              width={120}
              height={40}
            />
            <p className="about-title">Une passion devenue métier : le voyage autrement.</p>
            <p>
              Je m&apos;appelle Kouloud, tunisienne d&apos;origine, mère de deux enfants et fondatrice
              d&apos;une agence de tourisme locale engagée au Bénin. Mon parcours est tissé de
              cultures, de rencontres et de convictions profondes: voyager, oui — mais en
              conscience, en immersion, avec le cœur ouvert.
            </p>
            <p>
              Tout a commencé avec un besoin d&apos;ailleurs. Après plusieurs voyages en solo avec
              mon fils - originaire du Bénin...
            </p>
            <p>
              <a
                role="button"
                tabIndex={0}
                onClick={() => setExpanded((prev) => !prev)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setExpanded((prev) => !prev);
                }}
                aria-expanded={expanded}
                aria-controls="more-text"
              >
                {expanded ? "Réduire" : "Lire la suite..."}
              </a>
            </p>
            {/* Toujours monté (comme l'original) pour conserver la transition
                CSS max-height/opacity de #more-text lors du dépliage. */}
            <div id="more-text" className={expanded ? "expanded" : ""}>
              <p>
                - j&apos;ai découvert une Afrique loin des images figées que l&apos;on projette
                souvent en Europe. Un continent vivant, chaleureux, riche en traditions et en
                récits. Le Bénin, particulièrement, m&apos;a profondément marquée : j&apos;y suis
                retournée et chaque fois plus proche des habitants, de leurs coutumes, de leur
                quotidien.
              </p>
              <p>
                Mon amour pour le continent africain ne s&apos;est pas arrêté là. J&apos;ai exploré
                le Togo aux frontières du Ghana, et revisité mes propres racines à travers
                l&apos;Afrique du Nord, entre Tunisie et Maroc. Cette pluralité culturelle a
                renforcé en moi une certitude: le métissage est une force.
              </p>
              <p>
                C&apos;est pour cela que j&apos;ai fondé cette agence. Une agence pas comme les
                autres, dédiée à un tourisme traditionnel, authentique et respectueux, loin des
                circuits de masse.
              </p>
              <p>
                Chaque itinéraire est pensé comme une passerelle entre les cultures, une invitation
                à découvrir autrement, à ressentir, à écouter, à échanger. Parce que l&apos;Afrique
                mérite mieux qu&apos;un simple regard : elle mérite une rencontre.
              </p>
              <p>Bienvenue dans mon univers, où chaque voyage est un acte de lien et de sens.</p>
            </div>
          </div>
          <div className="round">
            <Image src="/images/photo.jpeg" alt="Kouloud" width={320} height={320} />
          </div>
        </div>
      </div>
    </section>
  );
}
