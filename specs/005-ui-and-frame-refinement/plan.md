# Plan d'Implémentation : 005-ui-and-frame-refinement

**Branche** : `005-ui-and-frame-refinement` | **Date** : 2026-09-19 | **Spécification** : [spec.md](./spec.md)

## Résumé

Refonte ergonomique et graphique de la suite de personnalisation du simulateur de QR code :
1. Suppression radicale de l'effet de double cadre en transformant l'aperçu en un canvas neutre de studio où le cadre choisi est l'unique conteneur du QR code (reproduction fidèle des modèles « Bandeau Inférieur » et « Badge Flottant avec flèche callout »).
2. Alignement des 5 formulaires de personnalisation (Wi-Fi, Couleurs, Cadre, Formes, Logo) sur la charte graphique luxueuse (Tailwind / Material 3) du site (cartes d'options visuelles, segmented buttons, swatches chromatiques, drag-and-drop soigné).

---

## Contexte Technique

- **Langage / Version** : TypeScript 5.4 / Angular 18 (Composants Standalone)
- **Dépendances Principales** : `qr-code-styling`, `html-to-image`, Tailwind CSS v4
- **Stockage** : 100% In-Memory (Architecture Zero-Serveur)
- **Tests** : Vitest pour les tests unitaires (Catégorie 2) et tests d'intégration (Catégorie 3)
- **Plateforme Cible** : Navigateur Web (Client-side avec compatibilité SSR)
- **Objectif de Performance** : Rendu visuel et bascule d'onglets < 50ms
- **Contraintes** : Respect strict du typage fort « à la Rust » (zéro `any`, `readonly`, exhaustivité), conformité totale à la Constitution du projet

---

## Constitution Check

- [x] **I. Architecture Frontend Pure & Zero-Serveur** : Tous les réglages et assets restent strictement en RAM navigateur.
- [x] **II. Génération Vectorielle & Intégrité Visuelle** : Rendu SVG pur via `qr-code-styling`, encapsulé proprement dans les gabarits de cadre HTML/CSS vectoriels.
- [x] **III. Hygiène Mémoire & Cycle de Vie des Blobs** : Révocation immédiate des blobs/URLs, désabonnement via `destroyRef`.
- [x] **IV. Découpage Architectural Angular** :
  - **Service** : `QrSimulatorService` gère l'état réactif via Signals.
  - **Smart Component** : `HomeComponent` orchestre les interactions globales.
  - **Dumb Components** : `SimulatorSectionComponent`, `FrameFormComponent`, `StylingFormComponent`, `ColorsFormComponent`, `LogoFormComponent`, `WifiFormComponent`.
- [x] **V. UX Sans Friction** : Aucune barrière à la configuration ni à l'aperçu temps réel.
- [x] **VI. Stratégie de Tests Proportionnée** : Tests unitaires sur les transformations d'état (Catégorie 2) et tests d'intégration sur l'orchestration des formulaires et du simulateur (Catégorie 3).
- [x] **Typage fort « à la Rust » (GEMINI.md)** : Zéro `any`, types discriminés, propriétés `readonly`.

---

## Structure du Projet

```text
specs/005-ui-and-frame-refinement/
├── plan.md              # Ce document
├── research.md          # Recherches et décisions techniques
├── data-model.md        # Modèles de données et interfaces strictes
├── quickstart.md        # Guide de validation manuelle et automatisée
├── contracts/           # Contrats d'interfaces des composants
│   └── README.md
└── tasks.md             # Tâches détaillées (générées par /speckit-tasks)

frontend/src/app/
├── core/models/
│   └── live-qr.model.ts (Enrichissement des types de cadre)
└── features/home/ui/
    ├── simulator-section/
    │   ├── simulator-section.component.ts (Gestion de l'onglet actif et de l'aperçu nettoyé)
    │   └── simulator-section.component.html (Nouveau canvas studio sans double boîte)
    └── qr-config-forms/
        ├── frame-form/ (Cartes visuelles pour bandeau, badge callout, arrondi)
        ├── styling-form/ (Cartes visuelles pour les formes de points)
        ├── colors-form/ (Segmented controls, swatches rapides, pipettes HEX)
        ├── logo-form/ (Zone d'upload raffinée et feedback)
        └── wifi-form/ (Segmented buttons chiffrement, inputs avec icônes)
```

---

## Suivi de la Complexité

Aucune déviation constitutionnelle. Le découpage s'appuie exclusivement sur les briques architecturales déjà en place.
