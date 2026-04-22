# Cahier des Charges Complet — Mémorial Numérique Familial

> **Projet :** Espace de recueillement et de partage privé  
> **Version :** 1.2  
> **Auteur :** Gervais Azanga Ayissi  
> **Date :** 22 Avril 2026

---

## 1. Vision et Objectifs

### 1.1 Contexte émotif

Le site n'est pas qu'un simple outil informatique ; c'est une **extension numérique de la mémoire**. L'approche est centrée sur la dignité, la sobriété et la facilité d'utilisation dans des moments de vulnérabilité émotionnelle.

### 1.2 Objectifs Stratégiques

- **Pérennité :** Garantir que les souvenirs (photos, textes) restent accessibles sur le long terme.
- **Accessibilité Universelle :** Interface ultra-simplifiée pour les aînés de la famille, tout en étant moderne pour les plus jeunes.
- **Intimité Absolue :** Un "jardin secret" technologique, loin du bruit des réseaux sociaux publics.

---

## 2. Identité Visuelle & UX (Identité "Premium")

_Inspiration : Style "Farewell" (Serein, Élégant, Institutionnel)_

- **Typographie :**
  - Titres : Serif élégante (ex: _Cormorant Garamond_) pour évoquer la solennité.
  - Corps : Sans-Serif moderne (ex: _Inter_) pour une lisibilité maximale sur mobile.
- **Palette de Couleurs :**
  - Fond : `#F9F8F6` (Stone 50) pour la douceur.
  - Texte : `#1C1917` (Stone 900) pour le contraste.
  - Accents : Or sourd ou Vert Sauge très sombre pour les éléments d'interaction.
- **Transitions :** Animations fluides (fade-in, parallaxe léger) via `Framer Motion` pour une sensation de calme.

---

## 3. Périmètre Fonctionnel (Détails)

### 3.1 Cœur de l'expérience (MVP)

1.  **Home Page (L'Hommage) :**
    - Hero section avec portrait plein écran (background dimmé).
    - Citation "fil rouge" qui définit la personne.
    - Navigation par "Tab Bar" fixe en bas (typique des apps mobiles) mais sur pc navigation sur le cote.
2.  **Biographie Interactive :**
    - Timeline verticale utilisant la technique du "Scroll-linked animation" (les éléments apparaissent au fur et à mesure du scroll).
3.  **Galerie "Héritage" :**
    - Gestion intelligente de l'aspect ratio (maçonnerie).
    - Visionneuse tactile avec zoom "pinch-to-zoom".
    - **Mode Upload Direct :** Activation de l'appareil photo mobile en un clic.
4.  **Livre d'Or (Témoignages) :**
    - Système de "Bougies virtuelles" (allumer une bougie en un clic).
    - Modération a-priori (le message n'apparaît que si l'admin valide).
5.  **Agenda Commémoratif :**
    - Calcul automatique de "X ans depuis le départ".
    - Affichage des dates religieuses ou symboliques selon le choix de la famille.

### 3.2 Futur / Phase 2

- **Mode PWA (Progressive Web App) :** Pour installer le mémorial comme une application sur l'écran d'accueil du téléphone.
- **Export "Livre de Vie" :** Générer un PDF structuré de tous les messages et photos pour l'impression d'un livre souvenir physique.

---

## 4. Architecture Technique (Stack)

- **Framework :** Next.js 14 (App Router) pour la rapidité et le SEO technique.
- **Authentification :** Clerk (Gestion des invitations par email uniquement).
- **Base de données :** Supabase (PostgreSQL).
- **Contenu Éditorial :** Sanity.io (Interface simple pour que la famille puisse modifier la biographie).
- **Hébergement :** Vercel (Serveur cloud haute performance).

---

## 5. Sécurité et Confidentialité

- **Protection RGPD :**
  - Pas de cookies publicitaires, pas d'analyse invasive.
  - Fonction de "Droit à l'oubli" : capacité de supprimer un média ou un message instantanément.
- **Contrôle d'accès :**
  - Authentification obligatoire.
  - Protection des fichiers images stockés (liens expirables).
- **Indésirabilité Google :** Configuration stricte des robots pour qu'aucune donnée familiale ne fuite sur les moteurs de recherche.

---

## 6. Livraison et Maintenance

| Jalons | Livrables                                                  |
| :----- | :--------------------------------------------------------- |
| **L1** | Déploiement du socle sécurisé (Auth + Landing).            |
| **L2** | Intégration de la biographie et des premières photos.      |
| **L3** | Mise en service du Livre d'Or et de l'espace admin mobile. |

---

## 7. Critères de Qualité prioritaires

1. **Lighthouse Score :** > 90 en Performance et Accessibilité.
2. **Robustesse :** Le site doit supporter des connexions simultanées le jour d'une commémoration.
3. **Temps de réponse :** Lecture de vidéo fluide sans buffering excessif sur réseau mobile.
