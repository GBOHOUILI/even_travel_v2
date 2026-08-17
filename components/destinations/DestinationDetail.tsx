import Image from "next/image";
import Link from "next/link";

import { DestinationGallery } from "@/components/destinations/DestinationGallery";
import type { Destination } from "@/types/destination";

const DEFAULT_IMAGE = "/images/travel.jpg";

function formatPracticalPrice(prix?: number): string {
  return prix ? `${prix.toLocaleString("fr-FR")} FCFA` : "Sur demande";
}

export function DestinationDetail({ destination }: { destination: Destination }) {
  const mainImageUrl = destination.images?.[0]?.url || DEFAULT_IMAGE;
  const hasSites = destination.sitesVisiter && destination.sitesVisiter.length > 0;
  const hasCulture = Boolean(destination.experiencesCulturelles);
  const hasGastronomie = destination.gastronomie && destination.gastronomie.length > 0;
  const nextAvailability = destination.datesDisponibles?.[0]?.debut;

  return (
    <>
      <section className="hero-section">
        <div className="hero-section__bg" aria-hidden="true">
          <Image src={mainImageUrl} alt="" fill sizes="100vw" priority />
        </div>
        <div className="hero-section__fg">
          <Image
            src={mainImageUrl}
            alt={destination.titre}
            fill
            sizes="(max-width: 768px) 100vw, 1400px"
            priority
          />
        </div>
      </section>

      <section className="main-content">
        <div className="content-left">
          <h1>{destination.titre}</h1>
          <div className="destination-meta">
            <span>📍 {destination.localisation}</span>
            <span>🌍 {destination.pays || "Afrique"}</span>
            <span>☀️ {destination.climat || "Climat tropical"}</span>
          </div>

          <div className="mobile-price-bar">
            <div>
              <span className="mobile-price-bar__label">Prix</span>
              <span className="mobile-price-bar__value">
                {formatPracticalPrice(destination.prix)}
              </span>
            </div>
            <a href="#info-card" className="mobile-price-bar__cta">
              Réserver
            </a>
          </div>

          <span className="eyebrow">Découverte</span>
          <h2>À propos de {destination.titre}</h2>
          <p>{destination.descriptionLongue || destination.description}</p>

          {hasSites && (
            <div>
              <span className="eyebrow">Incontournables</span>
              <h2>Sites à visiter</h2>
              <ul>
                {destination.sitesVisiter!.map((site) => (
                  <li key={site}>{site}</li>
                ))}
              </ul>
            </div>
          )}

          {hasCulture && (
            <div>
              <span className="eyebrow">Culture</span>
              <h2>Expériences culturelles</h2>
              <p>{destination.experiencesCulturelles}</p>
            </div>
          )}

          {hasGastronomie && (
            <div>
              <span className="eyebrow">Gastronomie</span>
              <h2>Saveurs locales</h2>
              <ul>
                {destination.gastronomie!.map((plat) => (
                  <li key={plat}>{plat}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="gallery-section">
            <span className="eyebrow">Galerie</span>
            <h2>Découvrez {destination.titre} en images</h2>
            <DestinationGallery images={destination.images ?? []} title={destination.titre} />
          </div>
        </div>

        <aside className="info-card" id="info-card">
          <div className="info-header">
            <span className="eyebrow">Informations pratiques</span>
            <h3>Guide du voyageur</h3>
          </div>

          <div className="destination-info">
            <div className="info-row">
              <span className="info-label">🌡️ Température</span>
              <span className="info-value">
                {destination.temperatureMin ?? 25}-{destination.temperatureMax ?? 32}°C
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">💰 Devise</span>
              <span className="info-value">{destination.devise || "Franc CFA (XOF)"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">🗣️ Langues</span>
              <span className="info-value">
                {destination.langues && destination.langues.length > 0
                  ? destination.langues.join(", ")
                  : "Français"}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">✈️ Aéroport</span>
              <span className="info-value">{destination.aeroport || "Non spécifié"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">⏰ Fuseau horaire</span>
              <span className="info-value">{destination.fuseauHoraire || "GMT+1"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">📅 Meilleure période</span>
              <span className="info-value">
                {destination.meilleurePeriode || "Novembre - Mars"}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">🏨 Budget journalier</span>
              <span className="info-value">{destination.budgetJournalier || "50-100€"}</span>
            </div>
            {nextAvailability && (
              <div className="info-row">
                <span className="info-label">📅 Prochaine disponibilité</span>
                <span className="info-value">
                  {new Date(nextAvailability).toLocaleDateString("fr-FR")}
                </span>
              </div>
            )}
            <div className="info-row">
              <span className="info-label">👥 Places disponibles</span>
              <span className="info-value">{destination.placesDisponibles ?? 0}</span>
            </div>
            <div className="info-row">
              <span className="info-label">💵 Prix</span>
              <span className="info-value">{formatPracticalPrice(destination.prix)}</span>
            </div>
          </div>

          <Link href={`/reservation?type=destination&id=${destination._id}`} className="cta-button">
            Réserver maintenant
          </Link>
          <Link href="/contact" className="cta-button" style={{ background: "var(--bronze)" }}>
            Planifier mon voyage
          </Link>
        </aside>
      </section>
    </>
  );
}
