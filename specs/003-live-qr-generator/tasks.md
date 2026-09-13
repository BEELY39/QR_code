# Tasks: Génération de QR Code Réel en Direct (Live Simulator)

**Input**: Design documents from /specs/003-live-qr-generator/
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/ui-contracts.md](./contracts/ui-contracts.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Création des modèles TypeScript stricts « à la Rust » et des constantes visuelles partagées.

- [ ] T001 [P] Create live QR TypeScript models and discriminated unions in frontend/src/app/core/models/live-qr.model.ts
- [ ] T002 [P] Create Base64 in-memory circular logo constant in frontend/src/app/core/constants/qr-logo.constant.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Mise à jour de l'état réactif et du contrat de service pré-requis pour les User Stories.

**⚠️ CRITICAL**: Aucun développement de User Story ne peut débuter avant l'achèvement de cette phase.

- [ ] T003 Update QrSimulatorService interface and reactive state contract in frontend/src/app/features/home/data-access/qr-simulator.service.ts

**Checkpoint**: Contrats et modèles prêts - le développement des User Stories peut débuter.

---

## Phase 3: User Story 1 - Rendu Vectoriel d'un Vrai QR Code Scannable avec Logo & ECL 30% (Priority: P1) 🎯 MVP

**Goal**: Remplacer l'illustration statique par un véritable QR code vectoriel SVG interactif généré par QrEngineService, scannable au smartphone, avec coins arrondis (extra-rounded), points centraux circulaires (dot), niveau d'erreur ECL fixé à 'H' (30%) et logo circulaire central.

**Independent Test**: Charger la page d'accueil, observer que le QR code SVG est généré avec coins adoucis, dégradé et logo central, et scanner avec un smartphone : le lien s'ouvre instantanément.

### Tests for User Story 1 (Catégorie 2 & 3)

- [ ] T004 [P] [US1] Add unit test for SVG generation with ECL H and central logo in frontend/src/app/features/home/data-access/qr-simulator.service.spec.ts
- [ ] T005 [P] [US1] Add integration test for live SVG rendering in frontend/src/app/features/home/home.component.spec.ts

### Implementation for User Story 1

- [ ] T006 [US1] Implement SVG generation with ECL H, luxury rounded styling, and central logo in frontend/src/app/features/home/data-access/qr-simulator.service.ts
- [ ] T007 [US1] Update SimulatorSectionComponent inputs and template to render dynamic SVG markup in frontend/src/app/features/home/ui/simulator-section/simulator-section.component.ts and frontend/src/app/features/home/ui/simulator-section/simulator-section.component.html
- [ ] T008 [US1] Wire live SVG markup binding in HomeComponent in frontend/src/app/features/home/home.component.ts and frontend/src/app/features/home/home.component.html

**Checkpoint**: À cette étape, User Story 1 (MVP) est 100% fonctionnelle, testée et scannable.

---

## Phase 4: User Story 2 - Bascule Interactive entre Mode "Lien" et Mode "Texte" (Priority: P2)

**Goal**: Permettre à l'utilisateur de basculer instantanément entre la création d'un QR code pour un lien web (avec préfixage automatique https://) et pour du texte brut (Wi-Fi, note), avec debounce fluide de 150 ms sur la saisie clavier.

**Independent Test**: Cliquer sur l'onglet "Texte", saisir un code Wi-Fi brut, vérifier que le QR code est recalculé en moins de 50 ms après debounce et scannable sous forme de texte brut.

### Tests for User Story 2 (Catégorie 2 & 3)

- [ ] T009 [P] [US2] Add unit tests for mode switching, URL normalization, and 150ms debounce in frontend/src/app/features/home/data-access/qr-simulator.service.spec.ts
- [ ] T010 [P] [US2] Add integration test for mode toggle and input handling in frontend/src/app/features/home/home.component.spec.ts

### Implementation for User Story 2

- [ ] T011 [US2] Implement setMode, setValue with 150ms debounce and URL normalization in frontend/src/app/features/home/data-access/qr-simulator.service.ts
- [ ] T012 [US2] Add Lien/Texte toggle buttons and dynamic placeholder in frontend/src/app/features/home/ui/simulator-section/simulator-section.component.ts and frontend/src/app/features/home/ui/simulator-section/simulator-section.component.html
- [ ] T013 [US2] Bind mode changes and debounced value updates in HomeComponent in frontend/src/app/features/home/home.component.ts and frontend/src/app/features/home/home.component.html

**Checkpoint**: Les modes Lien et Texte fonctionnent de manière réactive et indépendante.

---

## Phase 5: User Story 3 - Personnalisation Chromatique & Export du QR Code Réel (Priority: P3)

**Goal**: Synchroniser les dégradés chromatiques de luxe (Violet Pop, Menthe Fraîche, Sunset Coral, Cyan Électrique) sur le QR code réel généré, et permettre l'export direct du fichier vectoriel SVG via le bouton d'action.

**Independent Test**: Changer de palette, constater le changement immédiat du dégradé du QR code vectoriel, puis cliquer sur "Télécharger le QR Code" pour obtenir le fichier SVG scannable.

### Tests for User Story 3 (Catégorie 2 & 3)

- [ ] T014 [P] [US3] Add unit tests for palette color updates and SVG export in frontend/src/app/features/home/data-access/qr-simulator.service.spec.ts
- [ ] T015 [P] [US3] Add integration test for palette switching and download event in frontend/src/app/features/home/home.component.spec.ts

### Implementation for User Story 3

- [ ] T016 [US3] Implement dynamic gradient palette synchronization and downloadSvg in frontend/src/app/features/home/data-access/qr-simulator.service.ts
- [ ] T017 [US3] Connect download button event in frontend/src/app/features/home/ui/simulator-section/simulator-section.component.ts and frontend/src/app/features/home/ui/simulator-section/simulator-section.component.html
- [ ] T018 [US3] Wire download event handler in HomeComponent in frontend/src/app/features/home/home.component.ts

**Checkpoint**: Toutes les user stories sont terminées et intégrées.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Vérification du typage exhaustif à la Rust, validation de la couverture de tests et compilation de production.

- [ ] T019 [P] Add exhaustive TypeScript checking with never guard in frontend/src/app/features/home/data-access/qr-simulator.service.ts
- [ ] T020 Run full test suite with Vitest in frontend/
- [ ] T021 Run production SSR build validation in frontend/
- [ ] T022 Perform live validation following quickstart guide in specs/003-live-qr-generator/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Dépendances nulles - démarre immédiatement.
- **Foundational (Phase 2)**: Dépend de la Phase 1 - BLOQUE toutes les User Stories.
- **User Story 1 (Phase 3 - MVP)**: Dépend de la Phase 2.
- **User Story 2 (Phase 4)**: Dépend de la Phase 3.
- **User Story 3 (Phase 5)**: Dépend de la Phase 4.
- **Polish (Phase 6)**: Dépend de la finalisation des User Stories 1 à 3.

### Parallel Opportunities

- Phase 1 : T001 et T002 peuvent être créés en parallèle.
- Tests US1 : T004 (unitaire) et T005 (intégration) peuvent être écrits en parallèle.
- Tests US2 : T009 (unitaire) et T010 (intégration) peuvent être écrits en parallèle.
- Tests US3 : T014 (unitaire) et T015 (intégration) peuvent être écrits en parallèle.
- Polish : T019 peut s'exécuter en parallèle de la préparation des validations.

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Exécuter Phase 1 (Modèles & Constante Logo)
2. Exécuter Phase 2 (Mise à jour du contrat de base)
3. Exécuter Phase 3 (US1 - QR code SVG vectoriel scannable avec ECL 'H' et logo)
4. Valider le scan smartphone du MVP

### Incremental Delivery
1. Phase 1 + 2 + 3 -> MVP opérationnel et scannable
2. Phase 4 -> Commutateur Lien / Texte et debounce
3. Phase 5 -> Palettes dynamiques & Export SVG
4. Phase 6 -> Contrôles qualité, Vitest & build SSR
