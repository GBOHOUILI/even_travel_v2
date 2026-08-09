export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Contenu de la page FAQ. Repris à l'identique de FAQ.html (aucune donnée
 * dynamique côté backend pour cette page) — simplement extrait dans une
 * constante pour séparer le contenu de la présentation.
 */
export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Qu'est-ce qu'Even Travel ?",
    answer:
      "Even Travel est une agence spécialisée dans la création d'expériences de voyage immersives mêlant culture, événements, découvertes locales et moments exclusifs.",
  },
  {
    question: "Quelles destinations proposez-vous ?",
    answer:
      "Nous proposons actuellement des expériences au Bénin, au Togo, au Ghana, en Tunisie et au Maroc. De nouvelles destinations sont régulièrement ajoutées.",
  },
  {
    question: "Quels types d'activités sont disponibles ?",
    answer:
      "Voyages culturels, événements, excursions, expériences immersives et activités culinaires faisant découvrir les saveurs locales.",
  },
  {
    question: "Puis-je payer en plusieurs fois ?",
    answer:
      "Oui. Vous pouvez régler votre réservation en deux tranches : 50 % à la réservation et 50 % au plus tard deux semaines avant la date de l'expérience.",
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer: "Carte Bancaire, MTN Mobile Money et Moov Money.",
  },
  {
    question: "Proposez-vous des expériences sur mesure ?",
    answer:
      "Absolument. Nous concevons des expériences personnalisées selon vos envies, votre budget et votre planning.",
  },
];
