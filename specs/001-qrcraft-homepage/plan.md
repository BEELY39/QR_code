# Implementation Plan: Intégration de la Page d'Accueil QRCraft (Pixel Perfect)

**Branch**: `001-qrcraft-homepage` | **Date**: 2026-09-12 | **Spec**: [specs/001-qrcraft-homepage/spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-qrcraft-homepage/spec.md`

## Summary

Intégration fidèle (pixel-perfect) de la page d'accueil QRCraft issue de la maquette `modul_teste/` (`screen.png`, `DESIGN.md`, `code.html`) à la racine de l'application Angular 21 (`http://localhost:4200/`).
L'approche technique s'appuie sur le découpage architectural strict imposé par `GEMINI.md` :
- Un **Service réactif (`QrSimulatorService`)** gérant l'état du simulateur en mémoire avec des Signals Angular.
- Un **Smart Component (`HomeComponent`)** qui orchestre la vue et injecte le service.
- 7 **Dumb Components** spécialisés pour chaque section de la page d'accueil (Navbar, Hero, Simulateur, Atouts, Galerie, CTA, Footer).
- Configuration des variables Design System (couleurs, typographie Plus Jakarta Sans) dans Tailwind CSS v4 via `@theme`.

## Technical Context

**Language/Version**: TypeScript 5.9+, Angular 21.0.4

**Primary Dependencies**: Angular Common, Router, Forms, Tailwind CSS v4 (`@tailwindcss/postcss`)

**Storage**: In-Memory (RAM navigateur via Signals, aucune persistance serveur pour la V1)

**Testing**: Vitest 4.0+, Angular TestBed

**Target Platform**: Navigateurs modernes (Desktop, Tablette, Mobile)

**Project Type**: Application Web Frontend SPA / SSR-ready

**Performance Goals**: First Contentful Paint < 1.0s, mise à jour réactive du simulateur < 50ms, 60fps au défilement

**Constraints**: Respect strict du design `DESIGN.md`, zéro backend sollicité, conformité WCAG sur les contrastes

**Scale/Scope**: Page d'accueil complète (6 sections majeures), 1 Smart Component, 7 Dumb Components, 1 Service

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principe Constitutionnel | Statut | Justification |
|--------------------------|--------|---------------|
| **I. In-Memory & Zéro-Serveur** | **CONFORME** | Toute l'interactivité du simulateur est gérée dans la RAM du navigateur via des signaux Angular. Aucun appel réseau backend. |
| **II. Pur SVG & Intégrité Visuelle** | **CONFORME** | Les prévisualisations de QR codes utilisent du SVG vectoriel haute définition avec gestion des dégradés. |
| **III. Hygiène Mémoire** | **CONFORME** | Les états réactifs sont confinés au cycle de vie des composants sans fuite de mémoire. |
| **IV. Découpage Angular & CLI** | **CONFORME** | Tous les composants et services sont générés via `ng generate`. Séparation stricte Service / Smart / Dumb. |
| **V. Lazy Authentication** | **CONFORME** | Aucun SDK Google One-Tap n'est chargé ou exécuté sur la page d'accueil. Parcours 100% libre. |
| **VI. Tests Proportionnés** | **CONFORME** | Catégorie 1 pour les 7 dumb components visuels, Catégorie 2 pour `QrSimulatorService`, Catégorie 3 pour `HomeComponent`. |

## Project Structure

### Documentation (this feature)

```text
specs/001-qrcraft-homepage/
├── spec.md              # Spécification fonctionnelle et critères d'acceptation
├── plan.md              # Ce plan d'implémentation technique
├── research.md          # Résultats de recherche et décisions techniques Phase 0
├── data-model.md        # Modèle de données et interfaces TypeScript Phase 1
├── contracts/
│   └── ui-contracts.md  # Contrats d'entrées/sorties des composants Phase 1
├── quickstart.md        # Guide de validation et d'exécution Phase 1
└── checklists/
    └── requirements.md  # Checklist de conformité des exigences
```

### Source Code (frontend/src/app)

```text
frontend/src/
├── app/
│   ├── core/
│   │   └── models/
│   │       ├── palette.model.ts               # Interfaces ColorPalette & SimulatorState (Catégorie 1)
│   │       └── showcase.model.ts              # Interfaces FeatureCard & ShowcaseModel (Catégorie 1)
│   ├── features/
│   │   └── home/
│   │       ├── home.component.ts              # Smart Component (Catégorie 3 - Test Intégration)
│   │       ├── home.component.html
│   │       ├── home.component.spec.ts
│   │       ├── data-access/
│   │       │   ├── qr-simulator.service.ts    # Service Métier (Catégorie 2 - Test Unitaire)
│   │       │   └── qr-simulator.service.spec.ts
│   │       └── ui/                            # Dumb Components (Catégorie 1 - Aucun test requis)
│   │           ├── navbar/
│   │           ├── hero-section/
│   │           ├── simulator-section/
│   │           ├── features-section/
│   │           ├── showcase-section/
│   │           ├── cta-banner/
│   │           └── footer/
│   ├── app.component.ts                       # Shell avec <router-outlet />
│   ├── app.routes.ts                          # Route racine redirigeant vers HomeComponent
│   └── styles.css                             # Configuration @theme Tailwind CSS v4
```

**Structure Decision**: Architecture organisée par fonctionnalités (`features/home/`) avec sous-dossiers `data-access/` pour les services et `ui/` pour les composants de présentation dumb, conforme aux meilleures pratiques Angular et à `GEMINI.md`.

## Complexity Tracking

> Aucune violation des règles constitutionnelles. L'architecture respecte les standards minimaux nécessaires.
