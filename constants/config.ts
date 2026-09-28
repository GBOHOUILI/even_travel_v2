export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://even-travel-backend.onrender.com/api/v1";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);

export const SITE_NAME = "Even Travel";

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/even_travel?igsh=MTgxbWwwM3lvMXgwaA==",
  facebook: "https://www.facebook.com/share/182Y393fWk/?mibextid=wwXIfr",
  tiktok: "https://www.tiktok.com/@eventravel4?_r=1&_t=ZN-94HL34bF0QU",
} as const;

export const CONTACT_INFO = {
  address: "Cotonou, Bénin",
  email: "eventravel2@gmail.com",
  phone: "+330768655918",
  hours: {
    weekdays: "Lundi au Vendredi : 9h00 à 19h00",
    saturday: "Samedi : 9h00 à 12h00",
  },
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/events", label: "Événements" },
  { href: "/destinations", label: "Destinations" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "À propos" },
  { href: "/faq", label: "FAQ" },
] as const;

export const WHATSAPP = {
  // Numéro international sans "+" ni espaces (format wa.me)
  number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? CONTACT_INFO.phone.replace(/\D/g, ""),
  defaultMessage: "Bonjour, je souhaite en savoir plus sur vos services.",
} as const;

// Informations légales (source : extrait RCCM du 28-08-2024)
export const LEGAL_INFO = {
  companyName: "Even Travel",
  owner: "Kouloud BEN RAZINE",
  activity: "Tourisme, hébergement, location de véhicules et activités touristiques et culturelles",
  rccm: "RB/COT/24 A 103226",
  registrationDate: "28 août 2024",
  address: "Îlot 3741, Parcelle C, Akogbato (12ᵉ arrondissement), Cotonou, Bénin",
  publicationManager: "Kouloud BEN RAZINE",
  frontHost: "À COMPLÉTER (hébergeur du site)",
  apiHost: "Render (Render Services, Inc., États-Unis)",
  updatedAt: "28 septembre 2026",
} as const;
