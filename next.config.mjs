// next.config.mjs
/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== "production";

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "even-travel-backend.onrender.com",
      },
      {
        // Toutes les images (destinations, événements, articles) sont
        // hébergées sur Cloudinary — confirmé dans destinations.html
        // (isValidImageUrl) et blogs.html (cloudinaryUrl.includes('cloudinary.com')).
        // Sans cette entrée, next/image lève une erreur "hostname not
        // configured" dès qu'une image Cloudinary est rendue, ce qui
        // casse le rendu de toute la carte/section concernée.
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "img-src 'self' https: data:",
              `script-src 'self' 'unsafe-inline' https://cdn.kkiapay.me${isDev ? " 'unsafe-eval'" : ""}`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
              "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com",
              "connect-src 'self' https://even-travel-backend.onrender.com https://api.kkiapay.me https://cdn.kkiapay.me",
              // ⚠️ Domaine du widget (iframe de paiement) à confirmer avec la
              // doc Kkiapay / les requêtes réseau observées en sandbox avant
              // mise en production — non garanti à 100% ici.
              "frame-src https://widget.kkiapay.me https://widget-v3.kkiapay.me https://cdn.kkiapay.me",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
