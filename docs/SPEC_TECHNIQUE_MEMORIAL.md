# 🏗️ Spécification Technique Développeur — Site Mémorial Familial

**Version :** 1.2 | **Approche :** Mobile First | **Durée :** 10 jours ouvrés  
**Stack :** Next.js 14 · Tailwind CSS · Supabase · Clerk · Vercel

---

## Table des matières

1. [Stack & justification des choix](#1-stack--justification-des-choix)
2. [Architecture du projet](#2-architecture-du-projet)
3. [Configuration initiale](#3-configuration-initiale)
4. [Authentification — Clerk](#4-authentification--clerk)
5. [Base de données — Supabase](#5-base-de-données--supabase)
6. [Stockage fichiers — Supabase Storage](#6-stockage-fichiers--supabase-storage)
7. [Dashboard Administrateur — Supabase](#7-dashboard-administrateur--supabase)
8. [Pages & routes](#8-pages--routes)
9. [Composants UI](#9-composants-ui)
10. [Routes API internes](#10-routes-api-internes)
11. [Gestion des médias](#11-gestion-des-médias)
12. [Rôles & permissions](#12-rôles--permissions)
13. [Sécurité & confidentialité](#13-sécurité--confidentialité)
14. [Performance & PWA](#14-performance--pwa)
15. [Déploiement — Vercel](#15-déploiement--vercel)
16. [Variables d'environnement](#16-variables-denvironnement)
17. [Planning & priorités](#17-planning--priorités)
18. [Checklist avant mise en ligne](#18-checklist-avant-mise-en-ligne)

---

## 1. Stack & justification des choix

| Technologie       | Version         | Rôle                     | Pourquoi                                                    |
| ----------------- | --------------- | ------------------------ | ----------------------------------------------------------- |
| **Next.js**       | 14 (App Router) | Framework frontend + API | SSR, routing, API routes intégrées                          |
| **Tailwind CSS**  | 3.x             | Styles                   | Utilities Mobile First, pas de CSS custom à gérer           |
| **Clerk**         | Latest          | Authentification         | Invitation par email, gestion des rôles, UI auth prête      |
| **Supabase**      | Latest          | BDD + Storage            | PostgreSQL managé + bucket fichiers + RLS natif             |
| **Vercel**        | —               | Déploiement              | HTTPS auto, CI/CD, compatible Next.js natif                 |
| **Plausible**     | —               | Analytics                | Privacy-first, sans cookies, conforme RGPD                  |
| **Framer Motion** | Latest          | Animations               | Animations fluides pour la timeline et les transitions      |

### Séparation des responsabilités

- **Supabase** → données dynamiques (messages livre d'or, médias uploadés, commémorations) ET contenu éditorial (biographie, hommage).
- **Clerk** → identité des administrateurs et membres de la famille.
- **Vercel** → hébergement, déploiement continu depuis Git, certificat SSL auto.

---

## 2. Architecture du projet

### Arborescence complète

```
memorial-app/
│
├── app/                                  # Next.js 14 App Router
│   ├── page.tsx                          # Redirection vers /accueil
│   │
│   ├── (public)/                        # Pages accessibles à tous (Lecture)
│   │   ├── layout.tsx                    # Layout public — affiche Navbar Bottom Bar
│   │   ├── accueil/
│   │   │   └── page.tsx                  # Page hommage (portrait, citation, intro)
│   │   ├── biographie/
│   │   │   └── page.tsx                  # Page biographie (timeline)
│   │   ├── galerie/
│   │   │   └── page.tsx                  # Grille photos/vidéos
│   │   ├── livre-dor/
│   │   │   └── page.tsx                  # Fil de messages + formulaire public
│   │   └── commemorations/
│   │       └── page.tsx                  # Agenda des dates importantes
│   │
│   ├── (admin)/                         # Dashboard protégé (Admin/Édition)
│   │   ├── layout.tsx                    # Vérifie auth + rôle admin
│   │   └── dashboard/                    # Gestion hommage, bio, modération
│   │
│   └── api/                              # Routes API Next.js (serveur uniquement)
│       ├── messages/
│       │   └── route.ts                  # GET (liste) / POST (créer) / PATCH (réaction)
│       ├── galerie/
│       │   └── route.ts                  # GET (liste) / POST (upload fichier)
│       └── commemorations/
│           └── route.ts                  # GET (liste)
│
├── components/
│   ├── ui/                               # Primitives réutilisables (bouton, carte, modal...)
│   ├── Navbar.tsx                        # Navigation bottom bar mobile (5 liens)
│   ├── Timeline.tsx                      # Chronologie animée (étapes de vie)
│   ├── GalerieGrid.tsx                   # Grille responsive photos/vidéos
│   ├── MediaViewer.tsx                   # Viewer fullscreen avec swipe
│   ├── MessageCard.tsx                   # Carte message + réactions emoji
│   ├── MessageForm.tsx                   # Formulaire de dépôt de message
│   ├── UploadButton.tsx                  # Bouton flottant upload mobile (caméra native)
│   └── CommemorationsListe.tsx           # Liste des dates avec compteur symbolique
│
├── lib/
│   └── supabase.ts                       # Client Supabase (anon key, côté client)
│
├── middleware.ts                         # Protège uniquement les routes /admin
├── next.config.ts                        # Config Next.js (headers sécurité, domaines images)
├── tailwind.config.ts                    # Thème Tailwind (couleurs, polices, safe-area)
└── .env.local                            # Variables d'environnement (ne jamais commiter)
```

---

## 3. Configuration initiale

### 3.1 Créer le projet

Commande à exécuter une seule fois pour initialiser le projet avec toutes les options requises :

```bash
npx create-next-app@latest memorial-app \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --import-alias "@/*"
```

### 3.2 Packages à installer

```bash
# Authentification
npm install @clerk/nextjs

# Base de données
npm install @supabase/supabase-js

# UI et utilitaires
npm install clsx date-fns react-hot-toast lucide-react

# Composants accessibles
npm install @radix-ui/react-dialog @radix-ui/react-tabs

# Animations
npm install framer-motion
```



---

## 4. Authentification — Clerk

### 4.1 Configuration sur clerk.com

- Créer une nouvelle application sur [clerk.com](https://clerk.com)
- Activer uniquement le mode **Email + Password**
- Les membres de la famille et admins sont **invités** via Clerk
- Les rôles sont attribués via les **métadonnées publiques** (`role: "admin" | "famille"`)

### 4.2 Fichiers à créer ou modifier

| Fichier                    | Ce qu'il fait                                                         |
| -------------------------- | --------------------------------------------------------------------- |
| `app/layout.tsx`           | Envelopper toute l'app avec `<ClerkProvider>`                         |
| `middleware.ts`            | Protéger uniquement les routes `/admin`                               |
| `app/(admin)/layout.tsx`   | Vérifier côté serveur que l'utilisateur est admin                      |

### 4.3 Comportement du middleware

- Seules les routes `/admin` sont **privées**
- Les routes `/accueil`, `/biographie`, `/galerie`, `/livre-dor` sont **publiques en lecture**
- Après connexion admin, redirection vers `/admin/dashboard`

### 4.4 Récupérer l'utilisateur connecté

- Côté **serveur** (Server Components, API routes) : utiliser `auth()` de `@clerk/nextjs/server`
- Côté **client** (Client Components) : utiliser `useUser()` ou `useAuth()` de `@clerk/nextjs`
- Le `userId` Clerk sert d'identifiant pour relier les actions (uploads, messages) à un membre

### 4.5 Gestion des rôles

- Les rôles sont stockés dans `publicMetadata.role` de chaque utilisateur Clerk
- Modification des rôles **uniquement depuis le Dashboard Clerk** ou via l'API Clerk côté serveur
- Ne jamais permettre à un utilisateur de modifier son propre rôle côté client

---

## 5. Base de données — Supabase

### 5.1 Configuration sur supabase.com

- Créer un projet sur [supabase.com](https://supabase.com)
- Copier `Project URL` et `anon public key` → variables d'environnement
- Copier `service_role key` → variable serveur uniquement (ne jamais exposer côté client)

### 5.2 Schéma des tables

#### Table `messages` — Livre d'or

| Colonne      | Type          | Valeur par défaut                  | Description                      |
| ------------ | ------------- | ---------------------------------- | -------------------------------- |
| `id`         | `uuid`        | `gen_random_uuid()`                | Identifiant unique               |
| `auteur`     | `text`        | —                                  | Nom de l'auteur du message       |
| `contenu`    | `text`        | —                                  | Corps du message                 |
| `photo_url`  | `text`        | `null`                             | URL Supabase Storage (optionnel) |
| `approuve`   | `boolean`     | `false`                            | Visible uniquement si `true`     |
| `reactions`  | `jsonb`       | `{"coeur":0,"bougie":0,"fleur":0}` | Compteurs de réactions           |
| `user_id`    | `text`        | —                                  | `userId` Clerk de l'auteur       |
| `created_at` | `timestamptz` | `now()`                            | Date de soumission               |

#### Table `medias` — Galerie

| Colonne        | Type          | Valeur par défaut   | Description                            |
| -------------- | ------------- | ------------------- | -------------------------------------- |
| `id`           | `uuid`        | `gen_random_uuid()` | Identifiant unique                     |
| `type`         | `text`        | —                   | `'photo'` ou `'video'`                 |
| `storage_path` | `text`        | —                   | Chemin dans le bucket Supabase Storage |
| `legende`      | `text`        | `null`              | Légende optionnelle                    |
| `uploaded_by`  | `text`        | —                   | `userId` Clerk de l'uploader           |
| `created_at`   | `timestamptz` | `now()`             | Date d'upload                          |

Contrainte : `type IN ('photo', 'video')`

#### Table `commemorations` — Agenda

| Colonne       | Type          | Valeur par défaut   | Description                                 |
| ------------- | ------------- | ------------------- | ------------------------------------------- |
| `id`          | `uuid`        | `gen_random_uuid()` | Identifiant unique                          |
| `titre`       | `text`        | —                   | Intitulé de la commémoration                |
| `date`        | `date`        | —                   | Date (peut être une année fixe ou annuelle) |
| `description` | `text`        | `null`              | Détail optionnel                            |
| `recurrent`   | `boolean`     | `true`              | Se répète chaque année                      |
| `created_at`  | `timestamptz` | `now()`             | Date de création                            |

### 5.3 Sécurité Row Level Security (RLS)

**Activer RLS sur les 3 tables.** Règles à appliquer :

| Table            | Opération     | Condition                                   |
| ---------------- | ------------- | ------------------------------------------- |
| `messages`       | SELECT        | Utilisateur authentifié + `approuve = true` |
| `messages`       | INSERT        | Utilisateur authentifié uniquement          |
| `messages`       | UPDATE        | Réservé au rôle admin (via service role)    |
| `medias`         | SELECT        | Utilisateur authentifié uniquement          |
| `medias`         | INSERT        | Utilisateur authentifié uniquement          |
| `commemorations` | SELECT        | Utilisateur authentifié uniquement          |
| `commemorations` | INSERT/UPDATE | Réservé au rôle admin                       |

> ⚠️ Le `service_role_key` contourne le RLS — il ne doit être utilisé que dans les **API routes serveur**, jamais dans le code client.

---

## 6. Stockage fichiers — Supabase Storage

### 6.1 Créer le bucket

- Nom du bucket : `galerie-memorial`
- Visibilité : **Privé** (non public)
- Taille maximale par fichier : **200 Mo**

### 6.2 Politique d'accès au bucket

- Upload autorisé uniquement pour les utilisateurs authentifiés
- Lecture via **URL signée** (Signed URL) d'une durée de 1 an — générée côté serveur à chaque requête
- Suppression autorisée uniquement pour le Super Admin (via service role)

### 6.3 Organisation des fichiers dans le bucket

```
galerie-memorial/
├── photos/
│   └── {timestamp}-{nom-fichier}.webp
└── videos/
    └── {timestamp}-{nom-fichier}.mp4
```

---

## 7. Dashboard Administrateur Intégré

Le contenu est géré via un tableau de bord interne au lieu d'un outil externe.

### 7.1 Table `hommage` (Supabase)
Stockage des informations principales. Une seule ligne (ID=1).

### 7.2 Table `biographie` (Supabase)
Liste des étapes de vie pour la timeline.

### 7.3 Interface d'édition
Accessible via `/admin/dashboard`, elle permet de modifier directement les tables Supabase via des formulaires Next.js.

---

### 8.1 `/accueil` — Page hommage (PUBLIQUE)

**Source des données :** Supabase (`hommage`)

**Éléments à afficher :**

- Photo portrait en cercle (80×80 à 160×160 px selon écran), ombre, bordure subtile
- Nom complet en typographie serif grande
- Dates de naissance et de décès en texte secondaire
- Citation en italique, centrée, avec bordure gauche décorative
- Texte d'introduction (rendu depuis Portable Text Sanity)

**Comportement :** Page statique, pas d'interactivité. Données rechargées à chaque déploiement (ou à la revalidation Sanity).

### 8.2 `/biographie` — Chronologie (PUBLIQUE)

**Source des données :** Supabase (`biographie`)

**Éléments à afficher :**

- Titre de section "Sa vie"
- Composant `<Timeline>` avec toutes les étapes triées chronologiquement
- Chaque étape : point sur la ligne, année en monospace, titre en gras, description en texte secondaire, photo optionnelle en dessous

**Comportement :** Scroll vertical. Animation d'apparition de chaque étape au scroll (Framer Motion). Pas de pagination, toutes les étapes chargées d'un coup.

### 8.4 `/galerie` — Photos & Vidéos (privée)

**Source des données :** API interne `/api/galerie` (Client Component avec `useEffect`)

**Éléments à afficher :**

- Grille responsive (2 colonnes sur mobile, 3 sur tablette, 4 sur desktop)
- Chaque cellule : miniature de l'image ou vignette vidéo avec icône play
- Légende sous chaque média (si renseignée)
- Bouton flottant en bas à droite pour uploader (FAB — Floating Action Button)
- Loader visible pendant le chargement initial

**Comportement au tap :** Ouvrir le composant `<MediaViewer>` en fullscreen avec swipe gauche/droite pour naviguer entre les médias. Fermeture par swipe vers le bas ou bouton ×.

**Upload :** Le bouton flottant ouvre l'appareil photo natif du téléphone via `input[type=file][capture=environment]`.

### 8.5 `/livre-dor` — Messages (privée)

**Source des données :** API interne `/api/messages` (Client Component)

**Éléments à afficher :**

- Formulaire en haut : champ "Votre nom", champ texte multilignes, bouton envoyer
- Message de confirmation après soumission ("Votre message est en attente de validation")
- Fil chronologique des messages **approuvés** uniquement
- Chaque message : composant `<MessageCard>` avec auteur, date, contenu, réactions

**Comportement :** Après soumission, le message n'apparaît pas immédiatement dans la liste (il est `approuve: false`). L'admin reçoit une notification et valide depuis le Dashboard.

### 8.6 `/commemorations` — Agenda (privée)

**Source des données :** API interne `/api/commemorations` (Client Component)

**Éléments à afficher :**

- Titre de section "Dates importantes"
- Liste de cartes, une par commémoration
- Chaque carte : icône calendrier, titre, date formatée en français, icône récurrence si applicable
- **Compteur symbolique :** calcul automatique "X ans déjà" depuis la date de décès (calculé côté client avec `date-fns`)

---

## 9. Composants UI

### 9.1 `Navbar` — Navigation bas de page

**Type :** Client Component (`'use client'`)  
**Position :** `fixed bottom-0` — toujours visible, au-dessus du contenu  
**Hauteur :** 64px + `safe-area-inset-bottom` (pour les iPhones avec encoche)

**5 liens :**
| Lien | Route | Icône (lucide-react) |
|------|-------|----------------------|
| Hommage | `/accueil` | `Home` |
| Vie | `/biographie` | `BookOpen` |
| Galerie | `/galerie` | `Images` |
| Livre d'or | `/livre-dor` | `MessageSquare` |
| Dates | `/commemorations` | `Calendar` |

**Comportement :** Le lien actif est mis en surbrillance (texte plus foncé, icône remplie). Utiliser `usePathname()` pour détecter la route active.

### 9.2 `Timeline` — Chronologie

**Type :** Client Component (pour les animations Framer Motion)  
**Layout :** Colonne verticale avec une ligne de 1px à gauche. Chaque étape est décalée à droite (`padding-left: 3.5rem`).

**Anatomie d'une étape :**

- Rond de 12px positionné en absolu sur la ligne verticale
- Année en police monospace, couleur secondaire, petite taille
- Titre en `font-semibold`
- Description en texte secondaire, taille réduite, `line-height` genereux
- Photo optionnelle arrondie en dessous, si présente

**Animation :** Chaque étape apparaît avec `opacity: 0 → 1` et `x: -20 → 0`, décalage de `0.1s × index` (stagger).

### 9.3 `GalerieGrid` — Grille médias

**Type :** Client Component  
**Layout :** CSS Grid, gap de 4px, colonnes selon écran (2/3/4)  
**Chaque cellule :**

- `aspect-ratio: 1` (carré parfait)
- `overflow: hidden`
- Image avec `object-fit: cover`
- Pour les vidéos : fond gris + icône `Play` centrée en superposition
- Au tap : ouvrir `<MediaViewer>` avec l'index du média cliqué

### 9.4 `MediaViewer` — Viewer fullscreen

**Type :** Client Component  
**Affichage :** Plein écran, fond noir total, z-index maximum  
**Navigation :** Swipe gauche/droite (touch events ou Framer Motion `drag`)  
**Contenu :**

- Image : `object-fit: contain`, centré
- Vidéo : lecteur HTML5 natif, contrôles visibles
- Légende en bas si disponible
- Indicateur de position (ex : "3 / 12") en haut à droite
- Bouton fermeture `×` en haut à gauche

### 9.5 `MessageCard` — Carte message

**Type :** Client Component (pour les interactions de réaction)  
**Contenu :**

- Nom de l'auteur en `font-semibold`
- Date formatée en français (`date-fns/format` avec locale `fr`)
- Corps du message en texte secondaire
- 3 boutons de réaction : ❤️ `coeur` / 🕯️ `bougie` / 🌸 `fleur` avec compteur

**Règle métier des réactions :**

- Une seule réaction possible par utilisateur par message
- Une fois réagi, les autres boutons sont grisés
- Mémorisation locale via état React (pas de persistance par user — simplification MVP)
- Au tap : appel API `PATCH /api/messages` pour incrémenter le compteur en base

### 9.6 `MessageForm` — Formulaire dépôt message

**Type :** Client Component  
**Champs :**

- Champ texte : "Votre nom" (obligatoire, max 80 caractères)
- Textarea : "Votre message" (obligatoire, max 1000 caractères)
- Compteur de caractères visible sous le textarea
- Bouton "Déposer mon message" (désactivé si champs vides ou pending)

**États :**

- `idle` : formulaire vide, disponible
- `loading` : bouton avec spinner, champs désactivés
- `success` : message "Votre message est en attente de validation" — formulaire masqué
- `error` : message d'erreur rouge sous le formulaire

### 9.7 `UploadButton` — Bouton upload flottant

**Type :** Client Component  
**Positionnement :** `fixed bottom-20 right-4` (au-dessus de la Navbar)  
**Forme :** Rond (64×64px), fond sombre, icône `Upload` (lucide-react)  
**Comportement :**

- Tap → ouvre `input[type=file]` caché avec `accept="image/*,video/*"` et `capture="environment"`
- Pendant l'upload : icône remplacée par un spinner
- Succès : toast notification "Média ajouté !" via `react-hot-toast`
- Erreur : toast notification rouge

---

## 10. Routes API internes

Toutes les routes API sont dans `app/api/`. Elles vérifient systématiquement que l'utilisateur est connecté avec `auth()` de Clerk avant toute opération.

### 10.1 `GET /api/galerie`

**Rôle :** Récupérer la liste des médias  
**Auth :** Requise  
**Process :**

1. Vérifier `userId` avec Clerk
2. Requête Supabase : `SELECT * FROM medias ORDER BY created_at DESC`
3. Pour chaque média, générer une **Signed URL** via Supabase Storage (durée : 1 heure)
4. Retourner la liste avec les URLs signées incluses

**Réponse :** `{ medias: [...] }`

### 10.2 `POST /api/galerie`

**Rôle :** Uploader un nouveau média  
**Auth :** Requise  
**Content-Type :** `multipart/form-data`  
**Champs attendus :** `file` (Blob), `legende` (string optionnel)  
**Process :**

1. Vérifier `userId`
2. Déterminer le type (`photo` ou `video`) depuis `file.type`
3. Générer un nom de fichier unique : `{Date.now()}-{file.name}`
4. Upload vers Supabase Storage dans le dossier `photos/` ou `videos/`
5. Insérer une ligne dans la table `medias` avec le `storage_path`
6. Retourner le média créé

### 10.3 `GET /api/messages`

**Rôle :** Récupérer les messages approuvés  
**Auth :** Requise  
**Process :**

1. Vérifier `userId`
2. Requête : `SELECT * FROM messages WHERE approuve = true ORDER BY created_at DESC`
3. Retourner la liste

**Réponse :** `{ messages: [...] }`

### 10.4 `POST /api/messages`

**Rôle :** Soumettre un nouveau message (en attente de modération)  
**Auth :** Requise  
**Body JSON :** `{ auteur: string, contenu: string }`  
**Validation :**

- `auteur` : requis, 1–80 caractères
- `contenu` : requis, 1–1000 caractères
  **Process :**

1. Vérifier `userId`
2. Valider les champs
3. Insérer dans `messages` avec `approuve: false`
4. Retourner le message créé (sans affichage immédiat côté client)

### 10.5 `PATCH /api/messages`

**Rôle :** Incrémenter une réaction sur un message  
**Auth :** Requise  
**Body JSON :** `{ id: string, type: "coeur" | "bougie" | "fleur" }`  
**Process :**

1. Vérifier `userId`
2. Récupérer le message par `id`
3. Lire le champ `reactions` (JSONB)
4. Incrémenter `reactions[type]` de 1
5. Mettre à jour le message en base

### 10.6 `GET /api/commemorations`

**Rôle :** Récupérer la liste des commémorations  
**Auth :** Requise  
**Process :**

1. Vérifier `userId`
2. Requête : `SELECT * FROM commemorations ORDER BY date ASC`
3. Retourner la liste

---

## 11. Gestion des médias

### 11.1 Formats acceptés et limites

| Type   | Formats        | Taille maximale                     |
| ------ | -------------- | ----------------------------------- |
| Photos | JPG, PNG, WebP | 10 Mo par fichier                   |
| Vidéos | MP4, MOV       | 200 Mo, ou lien YouTube/Vimeo privé |
| Audio  | MP3, M4A       | 50 Mo                               |

### 11.2 Traitement automatique à l'upload

- Vérification du type MIME côté serveur (ne pas faire confiance à l'extension seule)
- Génération d'un nom de fichier unique avec timestamp pour éviter les collisions
- Les images sont stockées telles quelles (pas de conversion serveur en MVP)
- La conversion WebP et le redimensionnement peuvent être ajoutés en Phase 2 via `sharp`

### 11.3 Accès aux fichiers

- Bucket Supabase Storage en **mode privé**
- Chaque requête côté serveur génère une **Signed URL** avec expiration
- Durée recommandée pour l'API galerie : **1 heure** (les URLs sont rafraîchies à chaque appel)
- Durée recommandée pour les URLs intégrées dans les emails de rappel : **7 jours**

### 11.4 Optimisation des images (Next.js)

- Utiliser le composant `<Image>` de Next.js sur toutes les images
- Configurer `next.config.ts` pour autoriser les domaines Supabase et Sanity comme sources d'images
- Définir des `sizes` adaptées à chaque usage (ex : `(max-width: 768px) 50vw, 25vw` pour la grille galerie)
- Activer `loading="lazy"` par défaut (comportement natif du composant `<Image>`)

---

## 12. Rôles & permissions

### 12.1 Tableau des rôles

| Rôle           | Stockage                    | Droits                                                                 |
| -------------- | --------------------------- | ---------------------------------------------------------------------- |
| `admin`        | `publicMetadata.role` Clerk | Accès total : modération, invitations, gestion des membres, paramètres |
| `contributeur` | `publicMetadata.role` Clerk | Upload médias, dépôt de messages (sans modération obligatoire)         |
| `lecteur`      | `publicMetadata.role` Clerk | Consultation uniquement, réactions sur les messages                    |

### 12.2 Vérification des rôles dans les API routes

- Récupérer `userId` via `auth()` de Clerk
- Récupérer les métadonnées utilisateur via le SDK Clerk côté serveur (`clerkClient.users.getUser(userId)`)
- Lire `user.publicMetadata.role`
- Renvoyer `403 Forbidden` si le rôle est insuffisant

### 12.3 Flux d'invitation d'un membre

1. Super Admin va dans le Dashboard Clerk → **Users → Invite user**
2. Renseigne l'email + choisit le rôle dans les métadonnées
3. Clerk envoie automatiquement un email d'invitation avec un lien sécurisé
4. Le membre clique sur le lien, crée son mot de passe, et accède au site
5. L'admin peut révoquer l'accès à tout moment depuis le Dashboard Clerk

---

## 13. Sécurité & confidentialité

### 13.1 Protection des routes

- Middleware Next.js global (`middleware.ts`) qui bloque toute requête non authentifiée
- Vérification côté serveur dans chaque layout privé (double protection)
- Toutes les routes API vérifient `userId` en première ligne

### 13.2 Anti-indexation

- Fichier `public/robots.txt` avec `Disallow: /` pour tous les robots
- Balise `<meta name="robots" content="noindex, nofollow">` dans le root `layout.tsx`
- Export `metadata.robots` de Next.js 14 : `{ index: false, follow: false }`

### 13.3 Headers HTTP de sécurité

À configurer dans `next.config.ts` via la clé `headers()` :

| Header                   | Valeur                     | Protection                           |
| ------------------------ | -------------------------- | ------------------------------------ |
| `X-Frame-Options`        | `DENY`                     | Anti-clickjacking                    |
| `X-Content-Type-Options` | `nosniff`                  | Anti MIME-type sniffing              |
| `Referrer-Policy`        | `no-referrer`              | Pas de fuite d'URL dans les referers |
| `Permissions-Policy`     | `camera=(), microphone=()` | Désactive les capteurs inutiles      |

### 13.4 Analytics

- Intégrer **Plausible** (script léger, < 1 Ko)
- Aucun cookie déposé, conforme RGPD sans bannière
- Statistiques visibles uniquement par le Super Admin

### 13.5 Sauvegarde

- Activer les **sauvegardes automatiques quotidiennes** dans Supabase (Settings → Backups)
- Permettre un export ZIP complet (photos + textes + messages) à la demande
- L'export est une fonctionnalité Phase 2 (hors scope MVP)

---

## 14. Performance & PWA

### 14.1 Objectifs Lighthouse (mobile)

| Métrique              | Objectif     |
| --------------------- | ------------ |
| Performance           | ≥ 85         |
| Accessibilité         | ≥ 90         |
| Bonnes pratiques      | ≥ 90         |
| Chargement (4G moyen) | < 3 secondes |

### 14.2 Optimisations à appliquer

- Utiliser les **Server Components** Next.js autant que possible (pas de JS côté client inutile)
- Passer en Client Component uniquement quand l'interactivité l'exige
- Polices : utiliser `next/font` pour auto-héberger les polices (pas de requête Google Fonts)
- Images : toujours via le composant `<Image>` Next.js (optimisation + lazy loading automatiques)
- `loading="eager"` uniquement pour la photo portrait (above the fold)

### 14.3 PWA — Progressive Web App

Créer un fichier `public/manifest.json` avec :

| Champ              | Valeur                                 |
| ------------------ | -------------------------------------- |
| `name`             | "Mémorial Familial"                    |
| `short_name`       | "Mémorial"                             |
| `start_url`        | `/accueil`                             |
| `display`          | `standalone`                           |
| `background_color` | `#1c1917` (stone-900)                  |
| `theme_color`      | `#1c1917`                              |
| `icons`            | Icône 192×192 et 512×512 au format PNG |

Lier le manifest dans le `<head>` du root `layout.tsx`.  
Permet à la famille d'**ajouter le site à l'écran d'accueil** du téléphone comme une app native.

---

## 15. Déploiement — Vercel

### 15.1 Processus de déploiement

1. Pousser le code sur un dépôt **GitHub privé**
2. Connecter le dépôt à [vercel.com](https://vercel.com) (New Project → Import from GitHub)
3. Vercel détecte automatiquement Next.js et configure le build
4. Chaque `git push` sur `main` déclenche un nouveau déploiement automatique
5. Les Pull Requests génèrent des **Preview Deployments** (URLs de prévisualisation)

### 15.2 Configuration dans Vercel

- Ajouter toutes les variables d'environnement dans **Settings → Environment Variables**
- Configurer le domaine personnalisé dans **Settings → Domains**
- HTTPS est activé automatiquement par Vercel via Let's Encrypt
- Activer la **protection par mot de passe Vercel** sur les Preview Deployments (facultatif)

### 15.3 Build & cache

- Framework Preset : `Next.js` (détection automatique)
- Build Command : `next build` (par défaut)
- Output Directory : `.next` (par défaut)
- Node.js Version : 20.x (recommandé)

---

## 16. Variables d'environnement

### Fichier `.env.local` (développement local)

```
# ── Clerk ──────────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/accueil
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/

# ── Supabase ────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### Règles importantes

- Le fichier `.env.local` doit figurer dans `.gitignore` (ne jamais commiter)
- Les variables préfixées `NEXT_PUBLIC_` sont **exposées côté client** — ne jamais y mettre de clé secrète
- `SUPABASE_SERVICE_ROLE_KEY` et `CLERK_SECRET_KEY` sont **serveur uniquement** (sans préfixe `NEXT_PUBLIC_`)
- En production, les mêmes variables sont à saisir dans le Dashboard Vercel

---

## 17. Planning & priorités

| Jour    | Phase                       | Tâches détaillées                                                                              |
| ------- | --------------------------- | ---------------------------------------------------------------------------------------------- |
| **J1**  | Brief & collecte            | Réunion famille, récupération de tous les médias et textes, validation de la checklist contenu |
| **J2**  | Design UX/UI                | Maquettes Figma Mobile First : accueil, galerie, messages, biographie, couleurs, typographies  |
| **J3**  | Validation design           | Retours famille intégrés, design system figé (couleurs, espacements, typographies)             |
| **J4**  | Init + Auth                 | Création projet Next.js, configuration Clerk, middleware, page de connexion fonctionnelle      |
| **J5**  | Core pages                  | Pages Accueil et Biographie connectées à Sanity, Navbar mobile, layout privé                   |
| **J6**  | Galerie                     | Grille photos, viewer fullscreen, upload mobile, API galerie, Supabase Storage                 |
| **J7**  | Livre d'or + Commémorations | API messages, formulaire, modération, réactions, page agenda, compteur symbolique              |
| **J8**  | Admin + Sécurité            | Interface modération mobile, robots.txt, headers, noindex, PWA manifest                        |
| **J9**  | Tests & QA                  | Tests sur iPhone + Android, Lighthouse ≥ 85, corrections bugs, test upload 4G                  |
| **J10** | Mise en ligne               | Déploiement Vercel production, DNS, HTTPS, formation Super Admin, livraison                    |

---

## 18. Checklist avant mise en ligne

### Fonctionnel

- [ ] Connexion fonctionne sur iPhone (Safari) et Android (Chrome)
- [ ] Toutes les pages s'affichent correctement sur mobile (375px et 390px de large)
- [ ] Upload photo/vidéo fonctionne en 4G (< 2 minutes)
- [ ] Les messages soumis n'apparaissent pas avant modération
- [ ] Les réactions emoji s'enregistrent correctement en base
- [ ] Le compteur "X ans déjà" est correct
- [ ] Les membres invités ont bien reçu le lien d'invitation et pu se connecter

### Sécurité

- [ ] Aucune page n'est accessible sans être connecté
- [ ] `robots.txt` contient `Disallow: /`
- [ ] La balise `noindex` est présente sur toutes les pages
- [ ] HTTPS actif sur le domaine de production
- [ ] La `SUPABASE_SERVICE_ROLE_KEY` n'apparaît nulle part dans le code client
- [ ] Le dépôt Git est bien en mode **privé**

### Performance

- [ ] Score Lighthouse Mobile ≥ 85 sur les pages Accueil, Galerie, Livre d'or
- [ ] Chargement < 3 secondes sur réseau 4G simulé (Chrome DevTools)
- [ ] Pas d'images non optimisées (toutes via `<Image>` Next.js)

### Production

- [ ] Les sauvegardes automatiques Supabase sont activées
- [ ] Les variables d'environnement production sont renseignées dans Vercel
- [ ] Plausible Analytics est connecté et remonte des données
- [ ] Le Super Admin a été formé (modération, invitations, Sanity Studio)

---

_Document de référence technique — Projet Mémorial Familial — Usage interne développeur_  
_Gervais Azanga Ayissi — 18 avril 2026_
