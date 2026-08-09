# Even Travel — Frontend Next.js (migration)

Ce dépôt est le point de départ de la migration du frontend Even Travel,
de HTML/CSS/JS vanilla vers **Next.js 15 (App Router) + React 19 +
TypeScript + TailwindCSS + TanStack Query + React Hook Form + Zod +
Axios**.

Le design (couleurs, polices, espacements, animations, responsive) est
**strictement conservé** : le CSS d'origine a été repris quasiment à
l'identique dans `app/globals.css`, seuls quelques styles ont été ajoutés
pour les nouveaux composants (toasts, error/empty state) qui n'existaient
pas en vanilla JS.

---

## 1. Audit du frontend actuel

| Élément | Constat |
|---|---|
| Pages | 12 pages publiques (`index`, `about`, `contact`, `FAQ`, `destinations`, `destination_detail`, `events`, `event_detail`, `blogs`, `blog_detail` (dans `blogs.html`), `reservation`, `paiement`) + 3 pages admin (`login`, `admin-dashboard` (3620 lignes !), `admin-settings`). |
| Nav / Footer | Identiques sur toutes les pages → bons candidats pour des composants partagés `Navbar` / `Footer` (déjà fait). |
| API | Un seul backend : `https://even-travel-backend.onrender.com/api/v1` (+ `http://localhost:5000/api/v1` en dev dans le dashboard admin). Endpoints identifiés : `events`, `destinations`, `blog` (+ `/comments`), `reservations` (+ `/initier`, `/stats`, `/:id/status`), `payments` (+ `/stats`, `/:id/status`), `admin/articles`, `admin/comments` (+ `/approve`), `auth/me`, `auth/update-me`, `auth/update-password`, `auth/register`. |
| Auth | JWT stocké dans `localStorage` (`authToken`) → **à migrer vers cookies HttpOnly** posés par le backend (voir point d'attention ci-dessous). |
| Erreurs | Aucune gestion propre : `console.error` uniquement, pas de `alert()` trouvé sur les pages publiques mais aucun retour utilisateur structuré (toast/erreur) non plus. |
| Composants réutilisables identifiés | Navbar, Footer, Hero, EventCard, DestinationCard, BlogCard/ArticleCard, Carousel (générique, dupliqué 2x sur la home), SearchBar, Pagination (dashboard), Filters (dashboard), Modal (dashboard), Button, Loader/Spinner, EmptyState, ErrorState. |
| Sécurité | Le dashboard admin injecte potentiellement du contenu dynamique (commentaires, descriptions) — à passer par DOMPurify une fois les pages admin migrées. |

## 2. Architecture cible (mise en place)

```
even-travel-front/
├── app/                      # Routes (App Router)
│   ├── page.tsx              # ✅ migré (accueil)
│   ├── layout.tsx            # ✅ layout racine (fonts, providers, nav/footer)
│   ├── globals.css           # ✅ design system d'origine + tailwind
│   ├── loading.tsx / error.tsx / not-found.tsx / robots.ts / sitemap.ts  # ✅
│   ├── destinations/[slug]/  # ⏳ à migrer
│   ├── events/[slug]/        # ⏳ à migrer
│   ├── blog/[slug]/          # ⏳ à migrer
│   ├── reservation/          # ⏳ à migrer
│   ├── contact/, about/, faq/  # ⏳ à migrer
│   └── admin/{login,dashboard,settings}/  # ⏳ à migrer (découpage en modules)
├── components/
│   ├── layout/                # Navbar, Footer, menu mobile (✅)
│   ├── ui/                    # Button, Loader, EmptyState, ErrorState, ErrorBoundary (✅)
│   ├── home/                  # Sections spécifiques à la page d'accueil (✅)
│   └── admin/                 # ⏳ EventsTable, DestinationsTable, Sidebar, Topbar, etc.
├── features/                  # Feature-based : chaque domaine = api + hooks + types + composants
│   ├── events/                # ✅ api, hooks, keys
│   ├── destinations/          # ⏳ (structure créée, à remplir à l'étape "destinations.html")
│   ├── blog/, comments/, reservations/, payments/, auth/   # ⏳
├── lib/
│   ├── api.ts                 # ✅ client Axios unique (withCredentials, ApiError normalisée)
│   ├── queryClient.ts         # ✅ config TanStack Query (retry, staleTime)
│   ├── format.ts               # ✅ helpers (prix, troncature)
│   ├── useCarousel.ts          # ✅ hook générique carrousel (scroll, dots, autoplay)
│   └── useRevealOnScroll.ts    # ✅ hook générique reveal-on-scroll (IntersectionObserver)
├── providers/                  # QueryProvider, ToastProvider, AppProviders (✅)
├── types/                       # Event, Destination, Article, Comment, Reservation, Payment, Admin (✅)
├── constants/                   # config.ts (nav, contact, réseaux sociaux, URL API) (✅)
├── middleware.ts                 # ✅ stub protection /admin (à valider avec le nouveau backend)
└── public/images/                 # ⏳ à réintégrer (retirées temporairement selon consigne)
```

## 3. Point d'attention — Authentification

Le cahier des charges demande des cookies `HttpOnly` (jamais de JWT en
`localStorage`). `lib/api.ts` est déjà configuré avec `withCredentials:
true`, prêt à fonctionner avec des cookies de session. **Il faut valider
avec l'équipe backend** que :
- les endpoints `auth/*` posent bien un cookie `HttpOnly; Secure;
  SameSite=Lax` plutôt que de renvoyer un `token` dans le JSON ;
- le CORS autorise les requêtes credentialed depuis l'origine du
  frontend (`Access-Control-Allow-Credentials: true` + origin explicite,
  pas `*`).

En attendant cette confirmation, `middleware.ts` est un stub qui vérifie
la présence d'un cookie `session` — le nom exact sera à ajuster.

## 4. Ce qui a été migré à cette étape

**`index.html` → `app/page.tsx`**, entièrement, avec parité fonctionnelle :
- Menu hamburger mobile (`useMobileMenu`)
- Hero avec effet parallax et recherche (redirige vers `/events?q=`)
- Sections Intro, Activités, Value props, Grille destinations
- Carrousel "Destinations Phare" (statique) — `useCarousel`
- Carrousel "Événements à venir" — **branché sur l'API réelle** via
  `features/events` + TanStack Query (loading / error / empty states
  gérés proprement, plus de `console.log`/`alert`)
- Services, CTA, section À propos avec "Lire la suite" (transition CSS
  identique à l'original)
- Reveal-on-scroll (fade-in au scroll) via IntersectionObserver

**`destinations.html` → `app/destinations/page.tsx`** + **`destination_detail.html` → `app/destinations/[id]/page.tsx`** :
- `features/destinations/*` (api, keys, hooks `useDestinations`/`useDestination`)
- `types/destination.ts` **corrigé** par rapport à l'hypothèse initiale : le
  vrai modèle API utilise `titre`, `localisation`, `categorie`,
  `datesDisponibles`, `descriptionLongue`, `sitesVisiter`,
  `experiencesCulturelles`, `gastronomie`, `climat`, `devise`, `langues`,
  `aeroport`, etc. (déduit de l'usage réel dans le HTML d'origine, pas
  d'une supposition)
- `DestinationsExplorer` (client) : recherche + filtres pays/catégorie en
  temps réel (`filterDestinations`), identique au `liveFilter` d'origine
- `ImageCarouselModal` : composant **générique et réutilisable** qui
  remplace le carrousel modal dupliqué en JS vanilla — pourra servir pour
  les événements et le blog
- `DestinationDetail` : Server Component, fetch direct côté serveur
  (SEO + `generateMetadata` dynamique avec OpenGraph), `notFound()` sur 404
- Page détail passée de `?id=` (query string) à un vrai segment dynamique
  `/destinations/[id]` (convention Next.js, comportement identique pour
  l'utilisateur, lien mis à jour dans `DestinationCard`)
- Bouton "Réserver" et lien de réservation unifiés sur `?type=...&id=...`
  (l'original utilisait `id=` sur la liste mais `destinationId=` sur le
  détail — incohérence corrigée)

**`events.html` → `app/events/page.tsx`** + **`event_detail.html` → `app/events/[id]/page.tsx`** :
- `features/events/lib/filterEvents.ts` (recherche + catégorie + difficulté
  en temps réel, identique au `liveFilter` d'origine)
- `types/event.ts` **corrigé** de la même façon que `Destination` à l'étape
  précédente : le vrai modèle utilise `nom`, `categorie`, `difficulte`,
  `lieu`, `date`, `duree`, `tailleGroupeMin/Max`, `placesRestantes`,
  `momentsForts`, `itineraire` (jours + activités), `servicesInclus`/
  `servicesNonInclus`, `informationsPratiques`, `recommandations`
- `EventCard`, `EventsGrid`, `EventsExplorer`, `EventDetail`,
  `EventItinerary`, `EventBookingCard` (fiche sticky avec tarif, durée,
  groupe, langue, difficulté, bouton "Réserver maintenant")
- Page détail passée de `?id=` à `/events/[id]` (même traitement que
  Destinations), `generateMetadata` dynamique + `notFound()` sur 404

🐛 **Bug de collision CSS détecté et corrigé** : les classes
`.destinations-section` et `.events-section` étaient déjà utilisées par
les sections de la *homepage* (fonds sable/crème). En les réutilisant
telles quelles pour les pages de listing autonomes, celles-ci héritaient
du mauvais fond au lieu du blanc de l'original. Corrigé avec deux classes
dédiées `.destinations-listing-section` / `.events-listing-section`, et
les deux composants `Explorer` (destinations **et** events) ont été mis à
jour en conséquence — livré aussi en correctif de l'étape précédente.

**`blogs.html` → `app/blog/page.tsx`** + **`app/blog/[slug]/page.tsx`** :
- Découverte : il n'y a qu'un seul fichier `blogs.html` (pas de
  `blog_detail.html` séparé) — l'original est une mini-SPA qui bascule
  entre liste et détail via `#/article/slug` dans la même page. Migré
  vers de vraies routes Next.js `/blog` et `/blog/[slug]` (meilleur SEO,
  URLs partageables)
- `types/comment.ts` et `types/article.ts` **corrigés** : l'API expose le
  blog sous `/api/v1/blog` (pas `/articles`), les commentaires utilisent
  `nom`/`email`/`message`/`approved` (anglais, pas `approuve`). Pas de
  champ `catégorie` en base — déduite du titre/contenu côté client,
  logique reproduite à l'identique (`getArticleCategory`)
- `features/blog/*` : api, hooks (`useArticles`, `useArticle`,
  `useArticleComments`, `useSubmitComment` en mutation), helpers
  (extrait, date relative, initiales, optimisation Cloudinary identique
  à l'original)
- `ArticleGallery` réutilise le `ImageCarouselModal` générique (construit
  à l'étape Destinations) au lieu de dupliquer un modal simple —
  amélioration mineure (navigation entre images en plus du zoom)
- `CommentForm` : **React Hook Form + Zod** (remplace la validation
  manuelle + `alert()` de l'original), toasts de succès/erreur
- **Sécurité** : le contenu HTML de l'article (rédigé par les admins)
  est assaini avec `isomorphic-dompurify` avant injection dans le DOM
  (`dangerouslySetInnerHTML`), conformément au cahier des charges
- CSS blog entièrement **namespacé `.blog-*`** dès le départ (leçon des
  collisions `.hero`/`.section-title`/`.destinations-section` détectées
  aux étapes précédentes) — `.grid`, `.card`, `.btn`, `.toolbar` de
  l'original étaient des noms bien trop génériques pour être réutilisés
  tels quels
- Les commentaires restent visuellement **à l'intérieur** de la même
  carte blanche que l'article (`.blog-article-view`), comme dans
  l'original, via un pattern `children` : `ArticleDetail` (Server
  Component, contenu + SEO) englobe `CommentsSection` (Client Component,
  React Query + formulaire) sans que toute la page devienne client

**`reservation.html` → `app/reservation/page.tsx`** + **`paiement.html` → `app/paiement/page.tsx`** :
- `types/reservation.ts` **corrigé** : le vrai contrat de
  `POST /api/v1/reservations/initier` envoie un objet `client` imbriqué
  (`{nom, prenom, email, telephone}`) et non des champs à plat, plus
  `date`, `nombrePlaces`, `message`, `planPaiement`, `methodePaiement`
- `features/reservations/hooks/useReservableItem` : charge l'événement
  **ou** la destination réservé(e) selon `?type=&id=` (ou les anciens
  formats `?eventId=`/`?destinationId=`, conservés pour compatibilité) et
  normalise les champs qui diffèrent entre les deux modèles
  (`nom`/`titre`, `lieu`/`localisation`, `placesRestantes`/`placesDisponibles`)
- `ReservationForm` : **React Hook Form + Zod avec schéma dynamique**
  (`buildReservationSchema(maxPlaces)`) — le maximum de participants
  dépend du nombre de places réellement disponibles sur l'item chargé,
  impossible à exprimer avec un schéma Zod statique
- Plan de paiement (unique/deux tranches) reproduit à l'identique,
  calcul du total et du montant à payer immédiatement identique à
  l'original (`calculerTotal`)

### 🔁 Changement de prestataire de paiement : Moneroo → Kkiapay

En cours de route, le prestataire de paiement a changé. Le flux a été
entièrement adapté (pas juste un renommage) car les deux fonctionnent
différemment :

| | Moneroo (v1) | Kkiapay (v2, actuel) |
|---|---|---|
| Initiation | Backend appelle Moneroo, renvoie un `checkout_url` | Backend renvoie clé publique + montant, widget ouvert **côté client** |
| Étape suivante | Redirection **externe** (le navigateur quitte le site) | Widget **en overlay** sur `/reservation` (le site n'est jamais quitté) |
| Confirmation | Moneroo redirige vers notre `return_url` avec ses propres paramètres (`paymentId`, `paymentStatus`) | Le widget déclenche `addSuccessListener` en JS, **nous** appelons `POST /payments/verify`, **nous** contrôlons la redirection vers `/paiement` |

Ce que ça change concrètement dans le code :
- `types/kkiapay.d.ts` : déclarations ambiantes pour `window.openKkiapayWidget`/`addSuccessListener`/`addFailedListener`,
  exposées globalement par `https://cdn.kkiapay.me/k.js` (pas de package npm nécessaire)
- `components/reservation/KkiapayScript.tsx` : charge ce script une seule fois, uniquement sur `/reservation`
- `features/reservations/hooks/useKkiapayWidget.ts` : encapsule l'ouverture du widget et l'abonnement/désabonnement propre aux événements succès/échec
- `features/payments/api/payments.api.ts` + `useVerifyPayment` : `POST /payments/verify` avec `{transactionId, reservationId}` — le backend vérifie auprès de Kkiapay avec sa clé privée/secrète, jamais exposée côté client
- **`features/reservations/lib/pendingReservation.ts` (localStorage) supprimé** : il n'est plus nécessaire puisqu'on ne quitte plus le site — l'ID de réservation reste simplement en mémoire (`useRef`) pendant toute l'interaction avec le widget. **Si ce fichier existe encore dans votre copie du projet (livré à l'étape précédente), vous pouvez le supprimer.**
- `/paiement` (`PaymentStatus.tsx`) utilise maintenant **nos propres** paramètres (`reservationId`, `status=success|already_paid`) au lieu des paramètres imposés par Moneroo (`paymentId`, `paymentStatus`) — plus besoin de coordonner un `return_url` avec le backend, puisque c'est nous qui déclenchons cette redirection après vérification réussie
- Méthodes de paiement affichées dans le formulaire : **carte / MTN MoMo / Moov Money** (PayPal retiré, non supporté par Kkiapay ; Wave d'abord ajouté puis retiré — non reconnu par l'enum `methodePaiement` du modèle `Payment` backend)
- CSP (`next.config.mjs`) mise à jour : `cdn.kkiapay.me` en `script-src`/`connect-src`, `widget.kkiapay.me` en `frame-src`

### 🔧 Contrat vérifié contre le vrai code backend (3 bugs corrigés)

Une fois le dépôt backend réel fourni, plusieurs écarts sont apparus entre
mes hypothèses provisoires et le contrat effectif — corrigés :

1. **`payment` → `kkiapay`** : `POST /reservations/initier` renvoie
   `data.kkiapay` (pas `data.payment`). C'était LA cause du "ça ne s'ouvre
   pas" : `payment` était `undefined`, donc `payment.amount` plantait
   silencieusement dans le `catch` générique.
2. **`ApiError` ne propageait pas le champ `code`** : le backend renvoie
   `{status, message, code}` sur ses erreurs métier (`AppError`), avec des
   codes comme `already_paid`, `not_enough_seats`, `payment_failed`,
   `amount_mismatch` (voir `src/utils/AppError.js` et `errorHandler.js`
   côté backend). `lib/api.ts` ignorait ce champ — corrigé, `ApiError.code`
   est maintenant bien rempli. `already_paid` reçu en réponse de
   `/payments/verify` est maintenant traité comme un succès (redirection
   vers `/paiement?status=already_paid`), pas comme une erreur.
3. **`Reservation.statut` → `statutPaiement`**, enum réel
   `en_attente | acompte | paye | annule` (pas `confirmee`/`annulee`) ;
   `Payment.statut` en anglais `pending | paid | failed | cancelled | refunded`
   (pas `en_attente`/`reussi`/...) ; `Payment.methodePaiement` n'accepte que
   `carte | mtn | moov | autre`.

⚠️ **Champ actuellement inerte côté backend** : `POST /reservations/initier`
ne lit PAS `methodePaiement` dans le body (voir `initPayment` — seuls
`client, type, itemId, date, nombrePlaces, message, planPaiement` sont
déstructurés). Le formulaire l'envoie quand même (cohérence du design +
possible usage futur), mais il n'a aujourd'hui aucun effet : `confirmPayment`
déduit lui-même la méthode réelle depuis la réponse Kkiapay
(`transaction.source === "MOBILE_MONEY" ? "mtn" : "carte"`).

- 🐛 **Bug corrigé** (héritage de l'original, toujours valable) : le
  script original de `paiement.html` utilisait `html += ...` sans jamais
  déclarer `let html = ''`, ce qui levait une `ReferenceError` silencieuse.
  Remplacé par un rendu conditionnel React (plus de concaténation de
  chaînes)

## 5. Prochaines étapes (à faire page par page, comme demandé)

1. `contact.html`, `about.html`, `FAQ.html` → pages statiques simples
2. `admin/*` → `app/admin/**`, découpage du dashboard (3620 lignes) en
   modules indépendants (`EventsTable`, `DestinationsTable`,
   `ArticlesTable`, `ReservationsTable`, `PaymentsTable`,
   `CommentsTable`, `DashboardStats`, `Sidebar`, `Topbar`, `Forms`)

À chaque étape : explication des changements, parité fonctionnelle,
suppression du HTML/JS remplacé (dans le dépôt d'origine), application
reste fonctionnelle en permanence.

## 6. Validation effectuée

Ce projet a été réellement installé et compilé pour vérifier qu'il n'y a
aucune erreur, à chaque étape (y compris celle-ci) :

- `npm install` ✅
- `npx tsc --noEmit` ✅ (aucune erreur TypeScript, aucun `any`)
- `npx eslint .` ✅ (0 erreur, 0 warning, flat config ESLint 9 + `next/core-web-vitals`)
- `npx next build` ✅ (compilation, génération statique)

Deux corrections ont été faites suite à cette validation :
1. **`next@15.1.4` → `15.5.22`** : la version initialement prévue contient
   une CVE connue (voir le changelog Next.js), remplacée par la dernière
   version stable patchée de la branche 15.
2. **Image de fond du Hero** : déplacée du CSS (`background-image: url(...)`)
   vers un style inline dans `Hero.tsx`. Un `url()` en dur dans le CSS
   oblige webpack à trouver le fichier au moment du build ; comme les
   images sont temporairement absentes, cela cassait la compilation. Le
   style inline est aussi la pratique standard recommandée par Next.js
   pour une image dynamique.

⚠️ **Un seul point ne peut pas être vérifié dans cet environnement** : la
récupération des polices Google (`next/font/google`, Inter/Italiana/Marko
One/Playfair Display) échoue ici car le bac à sable n'a pas accès à
`fonts.googleapis.com`. C'est une limitation de cet environnement de test,
pas une erreur de code — `npm run build` fonctionnera normalement dans
votre environnement (ou en CI) avec un accès internet standard.

## 7. Installation

```bash
npm install
cp .env.example .env.local   # renseigner NEXT_PUBLIC_API_URL si besoin
npm run dev
```

Les images ont été temporairement retirées (selon consigne) : à copier
dans `public/images/` avec les mêmes noms de fichiers que dans le HTML
d'origine pour un rendu identique.
