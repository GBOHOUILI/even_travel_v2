import type { Metadata } from "next";
import { Inter, Italiana, Marko_One, Playfair_Display } from "next/font/google";

import { AppProviders } from "@/providers/AppProviders";
import { SITE_URL } from "@/constants/config";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const italiana = Italiana({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-italiana",
  display: "swap",
});

const markoOne = Marko_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marko",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Even Travel — Circuit et Immersion",
    template: "%s | Even Travel",
  },
  description:
    "Agence de tourisme basée à Cotonou. Voyages sur mesure, écotourisme, circuits culturels et expériences authentiques en Afrique.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Even Travel",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${italiana.variable} ${markoOne.variable} ${playfair.variable}`}
    >
      <head>
        {/* Font Awesome — bibliothèque d'icônes utilisée dans tout le design d'origine */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
