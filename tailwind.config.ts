import type { Config } from "tailwindcss";

// Les couleurs et espacements reprennent EXACTEMENT les variables CSS
// de la maquette d'origine (voir styles/globals.css :root) afin de
// garantir une parité visuelle à 100%.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sand: "var(--sand)",
        stone: "var(--stone)",
        terracotta: "var(--terracotta)",
        ochre: "var(--ochre)",
        bronze: "var(--bronze)",
        "deep-brown": "var(--deep-brown)",
        cream: "var(--cream)",
        "text-dark": "var(--text-dark)",
        "text-muted": "var(--text-muted)",
      },
      spacing: {
        xs: "var(--spacing-xs)",
        sm: "var(--spacing-sm)",
        md: "var(--spacing-md)",
        lg: "var(--spacing-lg)",
        xl: "var(--spacing-xl)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        italiana: ["var(--font-italiana)", "serif"],
        marko: ["var(--font-marko)", "serif"],
        playfair: ["var(--font-playfair)", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
