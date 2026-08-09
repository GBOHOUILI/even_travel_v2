export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://even-travel-backend.onrender.com/api/v1";

export const SITE_NAME = "Even Travel";

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/even_travel?igsh=MTgxbWwwM3lvMXgwaA==",
  facebook: "https://www.facebook.com/share/182Y393fWk/?mibextid=wwXIfr",
  tiktok: "https://www.tiktok.com/@eventravel4?_r=1&_t=ZN-94HL34bF0QU",
} as const;

export const CONTACT_INFO = {
  address: "Cotonou, Bénin",
  email: "eventravel79@gmail.com",
  phone: "+33781800811",
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
