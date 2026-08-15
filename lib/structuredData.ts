import { CONTACT_INFO, SITE_NAME, SITE_URL, SOCIAL_LINKS } from "@/constants/config";
import type { FaqItem } from "@/constants/faq";
import type { Article } from "@/types/article";
import type { Destination } from "@/types/destination";
import type { Event } from "@/types/event";

/**
 * Tous les schemas ci-dessous ne reprennent que des données réellement
 * disponibles dans les modèles/constantes existants du projet — aucune
 * valeur fictive (pas de faux avis, pas de note, pas de champ inventé).
 * Voir section 8 de l'audit SEO pour le détail des schemas retenus.
 */

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/** Organisation Even Travel — utilisé sur toutes les pages via le layout racine. */
export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: SITE_NAME,
    url: SITE_URL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cotonou",
      addressCountry: "BJ",
    },
    email: CONTACT_INFO.email,
    telephone: CONTACT_INFO.phone,
    sameAs: Object.values(SOCIAL_LINKS),
  };
}

/** Site — permet à Google de comprendre la structure globale du site. */
export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  };
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildTouristDestinationSchema(destination: Destination, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: destination.titre,
    description: destination.metaDescription || destination.description || undefined,
    url,
    image: destination.images?.map((img) => img.url),
    address: destination.localisation
      ? {
          "@type": "PostalAddress",
          addressLocality: destination.localisation,
          addressCountry: destination.pays || undefined,
        }
      : undefined,
  };
}

export function buildEventSchema(event: Event, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.nom,
    description: event.description || undefined,
    startDate: event.date || undefined,
    endDate: event.dateFin || undefined,
    url,
    image: event.images?.map((img) => img.url),
    location: event.lieu
      ? {
          "@type": "Place",
          name: event.lieu,
        }
      : undefined,
    offers:
      event.prix !== undefined
        ? {
            "@type": "Offer",
            price: event.prix,
            priceCurrency: "XOF",
            url,
            availability:
              event.placesRestantes && event.placesRestantes > 0
                ? "https://schema.org/InStock"
                : undefined,
          }
        : undefined,
    // Un event doit avoir un lieu physique OU en ligne pour être un Event Schema.org
    // valide selon les recommandations Google. Le modèle n'a pas de champ dédié à ce
    // jour — à revoir si le backend introduit un jour des événements 100% en ligne.
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  };
}

export function buildArticleSchema(article: Article, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.titre,
    image: article.images?.map((img) => img.url),
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt || article.publishedAt || article.createdAt,
    author: article.auteur
      ? {
          "@type": "Person",
          name: article.auteur,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    mainEntityOfPage: url,
  };
}

export function buildFaqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
