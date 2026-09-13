# Tasks: Installation et Configuration des Dépendances Cœur (V1)

**Feature Branch**: `002-core-dependencies`

**Input Documents**:
- Specification: [specs/002-core-dependencies/spec.md](./spec.md)
- Implementation Plan: [specs/002-core-dependencies/plan.md](./plan.md)
- Data Model: [specs/002-core-dependencies/data-model.md](./data-model.md)
- UI Contracts: [specs/002-core-dependencies/contracts/ui-contracts.md](./contracts/ui-contracts.md)
- Research: [specs/002-core-dependencies/research.md](./research.md)
- Quickstart Guide: [specs/002-core-dependencies/quickstart.md](./quickstart.md)

---

## Phase 1: Setup (Installation des Dépendances & Typages Stricts)

**Purpose**: Installation npm des 4 packages fondamentaux et déclaration des interfaces TypeScript.

- [ ] T001 Installer les packages tierces clés (qr-code-styling, html-to-image, @abacritt/angularx-social-login, jspdf) dans frontend/package.json
- [ ] T002 [P] Déclarer les contrats TypeScript pour le moteur QR vectoriel dans frontend/src/app/core/models/qr-engine.model.ts
- [ ] T003 [P] Déclarer les contrats TypeScript pour la capture DOM et l'export haute résolution dans frontend/src/app/core/models/export.model.ts
- [ ] T004 [P] Déclarer les contrats TypeScript pour l'authentification différée dans frontend/src/app/core/models/auth.model.ts

---

## Phase 2: Foundational (Génération CLI des Services d'Encapsulation)

**Purpose**: Création officielle via Angular CLI des briques d'infrastructure sous core/services/ avant implémentation métier.

**⚠️ CRITICAL**: Pré-requis obligatoire pour respecter la Règle n°1 (CLI Angular exclusif).

- [ ] T005 Générer le service QrEngineService via CLI Angular dans frontend/src/app/core/services/qr-engine.service.ts
- [ ] T006 [P] Générer le service DomExportService via CLI Angular dans frontend/src/app/core/services/dom-export.service.ts
- [ ] T007 [P] Générer le service DeferredAuthService via CLI Angular dans frontend/src/app/core/services/deferred-auth.service.ts

**Checkpoint**: Socle CLI en place — Les services d'infrastructure sont prêts pour l'injection et les tests unitaires.

---

## Phase 3: User Story 1 - Moteur de Génération Vectorielle QR Code (Priority: P1) 🎯 MVP

**Goal**: Fournir une abstraction sécurisée pour qr-code-styling, insensible aux crashs SSR et forçant l'ECL à Q/H.

**Independent Test**: Importer QrEngineService dans un composant, générer un QR code SVG vectoriel et vérifier l'absence d'erreur d'exécution en environnement browser et serveur.

### Tests for User Story 1 (Catégorie 2 - Test Unitaire)

- [ ] T008 [TEST] [US1] Écrire les tests unitaires isolés pour QrEngineService (garde isPlatformBrowser, no-op SSR, rendu SVG pur) dans frontend/src/app/core/services/qr-engine.service.spec.ts

### Implementation for User Story 1

- [ ] T009 [US1] Implémenter QrEngineService avec injection PLATFORM_ID et import dynamique de qr-code-styling dans frontend/src/app/core/services/qr-engine.service.ts

**Checkpoint**: Moteur vectoriel de QR Code opérationnel et sécurisé pour le SSR.

---

## Phase 4: User Story 2 - Moteurs d'Export & Capture Visuelle Haute Résolution (Priority: P2)

**Goal**: Fournir les méthodes de capture PNG haute résolution (@2x/@3x) et export PDF print-ready avec libération immédiate des Blobs.

**Independent Test**: Capturer un élément DOM Tailwind factice en mémoire et vérifier la production du Blob PNG et PDF avec appel du callback de révocation.

### Tests for User Story 2 (Catégorie 2 - Test Unitaire)

- [ ] T010 [TEST] [US2] Écrire les tests unitaires isolés pour DomExportService (capture PNG, conversion PDF, révocation URL.revokeObjectURL) dans frontend/src/app/core/services/dom-export.service.spec.ts

### Implementation for User Story 2

- [ ] T011 [US2] Implémenter DomExportService avec imports dynamiques (html-to-image, jspdf) et hygiène mémoire dans frontend/src/app/core/services/dom-export.service.ts

**Checkpoint**: Moteur de capture DOM et conversion PDF opérationnels.

---

## Phase 5: User Story 3 - Infrastructure d'Authentification Sociale Différée (Priority: P3)

**Goal**: Préparer l'authentification Google One-Tap différée sans sollicitation de script réseau distant au chargement.

**Independent Test**: Vérifier que DeferredAuthService s'instancie avec isInitialized=false et n'effectue aucun appel réseau au bootstrap de l'application.

### Tests for User Story 3 (Catégorie 2 - Test Unitaire)

- [ ] T012 [TEST] [US3] Écrire les tests unitaires isolés pour DeferredAuthService (état initial non-bloquant, gestion du mock/fallback) dans frontend/src/app/core/services/deferred-auth.service.spec.ts

### Implementation for User Story 3

- [ ] T013 [US3] Implémenter DeferredAuthService avec gestion d'état réactive (Signals) et fallback défensif dans frontend/src/app/core/services/deferred-auth.service.ts

**Checkpoint**: Infrastructure d'authentification différée prête et conforme au Principe V.

---

## Phase 6: Polish & Quality Gates

**Purpose**: Validation d'ensemble, exécution de la suite de tests et certification du build SSR.

- [ ] T014 [P] Exécuter la suite complète de tests Vitest via npm test dans frontend/
- [ ] T015 [P] Valider la compilation de production complète et SSR via npm run build dans frontend/
- [ ] T016 Valider le démarrage sans erreur du serveur de développement Angular via npm start

---

## Dependencies & Execution Order

### Phase Dependencies
- **Phase 1 (Setup)**: Démarrage immédiat — Débloque la Phase 2.
- **Phase 2 (Foundational)**: Dépend de la Phase 1 — Débloque toutes les User Stories.
- **Phase 3 (User Story 1 - MVP)**: Dépend de la Phase 2 — Peut être testée en autonomie.
- **Phase 4 (User Story 2)**: Dépend de la Phase 2 — Complète la suite d'exports.
- **Phase 5 (User Story 3)**: Dépend de la Phase 2 — Sécurise l'authentification différée.
- **Phase 6 (Polish & Quality)**: Dépend de la complétion des Phases 3, 4 et 5.

### Opportunités de Parallélisation [P]
- T002, T003, T004 peuvent être exécutés en parallèle lors du Setup.
- T006 et T007 peuvent être générés en parallèle lors de la Phase Foundational.
- T014 et T015 peuvent être exécutés en parallèle lors de la validation finale.

---

## Implementation Strategy

### 1. MVP d'abord (Phases 1, 2, 3)
Installer les packages et implémenter `QrEngineService` avec sa suite de tests unitaires, débloquant la capacité fondamentale de générer des QR codes vectoriels.

### 2. Capacités d'Export (Phase 4)
Ajouter `DomExportService` pour doter la plateforme de capture haute définition (PNG/PDF) pour les supports physiques de luxe.

### 3. Authentification Différée (Phase 5)
Mettre en place `DeferredAuthService` pour préparer le flux de sauvegarde sans friction.

### 4. Gates Qualité (Phase 6)
Contrôle complet des 100% de tests au vert et du build SSR de production.
