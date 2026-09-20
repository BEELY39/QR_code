# Tasks: Intégration de la Page d'Accueil QRCraft (Pixel Perfect)

**Feature Branch**: `001-qrcraft-homepage`

**Input Documents**:
- Specification: [specs/001-qrcraft-homepage/spec.md](./spec.md)
- Implementation Plan: [specs/001-qrcraft-homepage/plan.md](./plan.md)
- Data Model: [specs/001-qrcraft-homepage/data-model.md](./data-model.md)
- UI Contracts: [specs/001-qrcraft-homepage/contracts/ui-contracts.md](./contracts/ui-contracts.md)
- Research: [specs/001-qrcraft-homepage/research.md](./research.md)
- Quickstart Guide: [specs/001-qrcraft-homepage/quickstart.md](./quickstart.md)

---

## Phase 1: Setup (Shared Infrastructure & Design Tokens)

**Purpose**: Initialisation des tokens de style de la maquette (DESIGN.md), des polices et des modèles TypeScript.

- [X] T001 Injecter la configuration des tokens Design System (@theme) dans frontend/src/styles.css
- [X] T002 [P] Importer les polices Google Fonts Plus Jakarta Sans et Material Symbols dans frontend/src/index.html
- [X] T003 [P] Définir les modèles ColorPalette et SimulatorState dans frontend/src/app/core/models/palette.model.ts
- [X] T004 [P] Définir les modèles FeatureCard et ShowcaseModel dans frontend/src/app/core/models/showcase.model.ts

---

## Phase 2: Foundational (Architecture CLI & Shell Applicatif)

**Purpose**: Génération CLI des briques socles (Service réactif et Smart Component conteneur) et configuration du routage racine.

**⚠️ CRITICAL**: Pré-requis obligatoire avant l'implémentation des composants de présentation des User Stories.

- [X] T005 Générer le service réactif QrSimulatorService via CLI Angular dans frontend/src/app/features/home/data-access/qr-simulator.service.ts
- [X] T006 Générer le Smart Component conteneur HomeComponent via CLI Angular dans frontend/src/app/features/home/home.component.ts
- [X] T007 Configurer la route racine vers HomeComponent dans frontend/src/app/app.routes.ts et nettoyer frontend/src/app/app.component.html

**Checkpoint**: Socle prêt — le conteneur HomeComponent est branché sur la route `/`.

---

## Phase 3: User Story 1 - Découverte de l'Accueil et Navigation Principale (Priority: P1) 🎯 MVP

**Goal**: Afficher l'en-tête de navigation glassmorphism et la section héroïque avec le QR Code Bistro Premium et les badges de réassurance.

**Independent Test**: Accéder à `http://localhost:4200/` : la navbar sticky et la section hero s'affichent fidèlement à la maquette avec toutes leurs pastilles visuelles.

### Implementation for User Story 1

- [X] T008 [P] [US1] Générer le Dumb Component NavbarComponent via CLI Angular dans frontend/src/app/features/home/ui/navbar/navbar.component.ts
- [X] T009 [P] [US1] Générer le Dumb Component HeroSectionComponent via CLI Angular dans frontend/src/app/features/home/ui/hero-section/hero-section.component.ts
- [X] T010 [US1] Implémenter le gabarit et les styles pixel-perfect dans frontend/src/app/features/home/ui/navbar/navbar.component.html
- [X] T011 [US1] Implémenter le gabarit pixel-perfect de la section hero (titre dégradé, badges, carte bistro) dans frontend/src/app/features/home/ui/hero-section/hero-section.component.html
- [X] T012 [US1] Intégrer NavbarComponent et HeroSectionComponent dans frontend/src/app/features/home/home.component.html

**Checkpoint**: User Story 1 (MVP d'accueil) fonctionnelle et testable de manière autonome.

---

## Phase 4: User Story 2 - Simulateur Express Interactif en Direct (Priority: P2)

**Goal**: Rendre le simulateur express opérationnel avec mise à jour réactive (Signals) de l'aperçu du QR code, sélection des 4 palettes et texte du bandeau.

**Independent Test**: Taper un texte ou sélectionner une palette dans le formulaire du simulateur : l'aperçu dynamique met à jour les couleurs et le libellé instantanément (<50ms).

### Tests for User Story 2 (Catégorie 2 - Test Unitaire)

- [X] T013 [P] [US2] Écrire les tests unitaires isolés pour QrSimulatorService dans frontend/src/app/features/home/data-access/qr-simulator.service.spec.ts

### Implementation for User Story 2

- [X] T014 [US2] Implémenter la logique d'état réactive (Signals Angular) dans frontend/src/app/features/home/data-access/qr-simulator.service.ts
- [X] T015 [P] [US2] Générer le Dumb Component SimulatorSectionComponent via CLI Angular dans frontend/src/app/features/home/ui/simulator-section/simulator-section.component.ts
- [X] T016 [US2] Implémenter le gabarit pixel-perfect du simulateur (formulaire et carte réactive) dans frontend/src/app/features/home/ui/simulator-section/simulator-section.component.html
- [X] T017 [US2] Connecter SimulatorSectionComponent aux signaux de QrSimulatorService dans frontend/src/app/features/home/home.component.ts et frontend/src/app/features/home/home.component.html

**Checkpoint**: User Stories 1 et 2 complètes et interactives.

---

## Phase 5: User Story 3 - Exploration des Atouts & Cas d'Usage Réels (Priority: P3)

**Goal**: Intégrer les sections de réassurance ("Pourquoi vos QR Codes méritent mieux..."), la galerie de cas concrets d'hôtellerie, la bannière CTA et le pied de page complet.

**Independent Test**: Faire défiler la page : les 4 atouts produit, les 4 cas réels avec photographies, la bannière d'engagement et le footer complet s'affichent sans rupture.

### Implementation for User Story 3

- [X] T018 [P] [US3] Générer le Dumb Component FeaturesSectionComponent via CLI Angular dans frontend/src/app/features/home/ui/features-section/features-section.component.ts
- [X] T019 [P] [US3] Générer le Dumb Component ShowcaseSectionComponent via CLI Angular dans frontend/src/app/features/home/ui/showcase-section/showcase-section.component.ts
- [X] T020 [P] [US3] Générer le Dumb Component CtaBannerComponent via CLI Angular dans frontend/src/app/features/home/ui/cta-banner/cta-banner.component.ts
- [X] T021 [P] [US3] Générer le Dumb Component FooterComponent via CLI Angular dans frontend/src/app/features/home/ui/footer/footer.component.ts
- [X] T022 [US3] Implémenter le gabarit des 4 cartes d'atouts dans frontend/src/app/features/home/ui/features-section/features-section.component.html
- [X] T023 [US3] Implémenter le gabarit de la galerie d'inspirations dans frontend/src/app/features/home/ui/showcase-section/showcase-section.component.html
- [X] T024 [US3] Implémenter le gabarit de la bannière finale dans frontend/src/app/features/home/ui/cta-banner/cta-banner.component.html
- [X] T025 [US3] Implémenter le gabarit du pied de page dans frontend/src/app/features/home/ui/footer/footer.component.html
- [X] T026 [US3] Assembler l'intégralité des sections dans frontend/src/app/features/home/home.component.html

**Checkpoint**: La page d'accueil complète est intégrée de façon pixel-perfect.

---

## Phase 6: Polish & Validation Finale (Quality Gates)

**Purpose**: Validation d'intégration, vérification de la build et passage des tests de non-régression.

- [X] T027 Écrire le test d'intégration du Smart Component HomeComponent dans frontend/src/app/features/home/home.component.spec.ts (Catégorie 3)
- [X] T028 [P] Exécuter la suite complète de tests Vitest via npm test dans frontend/
- [X] T029 [P] Valider la compilation de production et SSR via npm run build dans frontend/
- [X] T030 Valider le rendu final en direct selon les scénarios de specs/001-qrcraft-homepage/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies
- **Phase 1 (Setup)**: Démarrage immédiat, aucune dépendance.
- **Phase 2 (Foundational)**: Dépend de la Phase 1 — **Bloque** toutes les User Stories.
- **Phase 3 (User Story 1 - MVP)**: Dépend de la Phase 2 — Peut être testée en autonomie.
- **Phase 4 (User Story 2)**: Dépend de la Phase 2 — Connecte le service et le simulateur.
- **Phase 5 (User Story 3)**: Dépend de la Phase 2 — Complète les sections vitrines.
- **Phase 6 (Polish & Quality)**: Dépend de la complétion des User Stories.

### Opportunités de Parallélisation [P]
- T002, T003, T004 peuvent être exécutés en parallèle lors du Setup.
- T008 et T009 peuvent être générés en parallèle pour l'US1.
- T018, T019, T020, T021 peuvent être générés en parallèle pour l'US3.
- T028 et T029 peuvent être exécutés en parallèle lors de la validation.

---

## Implementation Strategy

### 1. MVP d'abord (Phases 1, 2, 3)
Créer l'infrastructure de style et le premier écran d'accueil avec Navbar et Hero section, validant la conformité esthétique dès la racine `/`.

### 2. Interactivité (Phase 4)
Ajouter la logique réactive (Signals) et le simulateur temps réel.

### 3. Complétude Visuelle (Phase 5)
Ajouter les sections Atouts, Galerie, CTA et Footer pour une fidélité 100% pixel-perfect avec la maquette Google `code.html`.

### 4. Gates Qualité (Phase 6)
Vérification des tests (unitaires Catégorie 2 + intégration Catégorie 3) et du build SSR.
