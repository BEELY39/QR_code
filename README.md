# QRCraft — Générateur de QR Code Personnalisé & Vectoriel

[![Quality Gate (Lint, Test, Build)](https://github.com/BEELY39/QR_code/actions/workflows/ci.yml/badge.svg)](https://github.com/BEELY39/QR_code/actions/workflows/ci.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge/deploy-status)](https://qrcraft-generation.netlify.app/)

QRCraft est une application web moderne (Angular 21 + SSR/SSG) permettant de générer des QR Codes professionnels, esthétiques et hautement personnalisables (logos, palettes de couleurs, formats Wi-Fi, cadrages sur-mesure) avec un rendu 100% vectoriel SVG et une exécution purement client-side (zéro-serveur, respect total de la confidentialité).

---

## 🛠️ Architecture & Stack Technique

- **Framework Frontend** : Angular 21 (Standalone Components, Signals, Reactive Forms)
- **Rendu & Prerendering** : Angular SSR / SSG (Server-Side Rendering pour SEO optimal)
- **Moteur Vectoriel** : `qr-code-styling` (Pur SVG vectoriel, niveaux de correction Q et H)
- **Styling** : Tailwind CSS v4
- **Tests Automatisés** : Vitest (121 tests unitaires et d'intégration)
- **Hébergement & Déploiement** : Netlify (Edge CDN, redirections SPA transparentes)

---

## 🚀 Pipeline d'Intégration Continue (CI) & Quality Gate

Le projet est protégé par une pipeline GitHub Actions automatisée ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) qui s'exécute à chaque **Push** et chaque **Pull Request** ciblant la branche `main` :

1. **Environnement Vierge** : Runner `ubuntu-latest` avec Node.js 22.x LTS.
2. **Installation Déterministe** : `npm ci` avec mise en cache npm (`~/.npm`).
3. **Analyse Statique (Lint)** : Contrôle strict du typage TypeScript via `tsc -b --noEmit`.
4. **Tests Automatisés** : Exécution headless de la suite complète de tests via `ng test --watch=false`.
5. **Compilation de Production** : Build complet client et serveur avec pré-rendu des routes statiques.

> **Barrière Qualité (Branch Protection)** :  
> Le statut unifié **`Quality Gate (Lint, Test, Build)`** est configuré comme prérequis bloquant sur la branche `main`. Toute Pull Request présentant un échec de lint, de test ou de compilation ne peut pas être fusionnée.

---

## 💻 Développement Local

Pour lancer le projet et exécuter les mêmes contrôles que la CI sur votre machine locale :

```bash
# Accéder au dossier frontend
cd frontend

# Installer les dépendances exactes
npm ci

# Lancer le serveur de développement local
npm start

# Exécuter les contrôles de parité CI en local :
npm run lint       # Analyse statique et typage strict
npm run test:ci    # Suite de tests automatisés (121 tests)
npm run build      # Compilation de production
```
