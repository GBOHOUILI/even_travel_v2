import { NextResponse, type NextRequest } from "next/server";

/**
 * Ce middleware ne fait plus de vérification de session.
 *
 * Pourquoi : le cookie `jwt` est posé par le backend sur son propre
 * domaine (even-travel-backend.onrender.com), pas sur celui du
 * frontend. `request.cookies` ne contient que les cookies envoyés AU
 * SERVEUR NEXT.JS par le navigateur — jamais un cookie tiers appartenant
 * à un autre domaine, quel que soit son nom (l'ancienne version
 * cherchait d'ailleurs un cookie "session" qui n'a jamais existé — le
 * vrai cookie s'appelle "jwt"). Ce contrôle ne peut donc structurellement
 * jamais fonctionner tel quel, et redirigeait systématiquement vers
 * /admin/login avant même que la page ne s'affiche.
 *
 * Le garde-fou réel vit maintenant côté client dans
 * `components/admin/AdminAuthGuard.tsx`, via un appel direct
 * navigateur → backend (`/auth/me`) où le cookie circule normalement.
 *
 * Fix propre à terme : proxifier les appels API à travers le domaine du
 * frontend (rewrites Next.js) pour que le cookie devienne first-party —
 * ce middleware redeviendra alors utile comme première ligne de défense
 * (évite le flash de page protégée avant redirection côté client).
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
