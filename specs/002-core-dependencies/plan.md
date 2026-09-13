# Implementation Plan: Installation et Configuration des Dépendances Cœur (V1)

**Branch**: `002-core-dependencies` | **Date**: 2026-09-13 | **Spec**: [specs/002-core-dependencies/spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-core-dependencies/spec.md`

## Summary

Cette fonctionnalité met en place l'infrastructure logicielle et les bibliothèques tierces nécessaires à la V1 de QRCraft :
1. `qr-code-styling` pour la génération vectorielle native (SVG pur, dots stylisés, dégradés et incrustation centrale de logo avec ECL forcé à Q/H).
2. `html-to-image` pour la capture DOM haute résolution des gabarits Tailwind CSS (chevalets de table, menus, vitrines).
3. `jspdf` pour l'export vectoriel PDF prêt pour l'impression physique haute fidélité (300 DPI).
4. `@abacritt/angularx-social-login` pour préparer l'authentification Google One-Tap différée sans blocage au chargement.

Toutes les manipulations DOM sont encapsulées dans des services Angular dédiés (Catégorie 2) vérifiant `isPlatformBrowser(this.platformId)` et important dynamiquement les modules, protégeant le serveur SSR Express et le prerendering statique contre tout crash `document is not defined`.

---

## Technical Context

**Language/Version**: TypeScript ~5.9.2 / Node.js 20+ / Angular 21.0.4

**Primary Dependencies**: `qr-code-styling` (^1.9.2), `html-to-image` (^1.11.13), `jspdf` (^4.2.1), `@abacritt/angularx-social-login` (^2.6.0)

**Storage**: In-Memory / Local Browser RAM uniquement (0 backend, 0 base de données, 0 stockage cloud en V1)

**Testing**: Vitest 4.0.8, JSDOM, Angular TestBed (Tests unitaires Catégorie 2 pour les services d'encapsulation)

**Target Platform**: Navigateurs modernes (Chrome, Safari, Firefox, Edge) + Node.js pour le SSR Angular Universal

**Project Type**: Application Web Frontend avec Server-Side Rendering (SSR)

**Performance Goals**: Temps de génération SVG < 50ms, Capture d'image PNG/PDF < 500ms, Zéro impact sur le FCP/LCP initial

**Constraints**: Respect absolu du SSR (isPlatformBrowser), Hygiène mémoire (URL.revokeObjectURL), Zéro `any`

**Scale/Scope**: 4 bibliothèques clés, 3 services d'encapsulation générés via CLI, 3 contrats TypeScript stricts

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principe Constitutionnel | Statut | Justification |
| :--- | :---: | :--- |
| **I. Architecture Frontend Pure & Zéro-Serveur (In-Memory)** | **PASS** | Toutes les dépendances opèrent strictement côté client dans la RAM du navigateur. Aucun appel API serveur. |
| **II. Génération Vectorielle & Intégrité Visuelle (SVG & Correction Q/H)** | **PASS** | `qr-code-styling` retenu pour son rendu natif en SVG pur et le contrôle strict de l'Error Correction Level (`Q`/`H`). |
| **III. Hygiène Mémoire & Cycle de Vie des Blobs** | **PASS** | `DomExportService` intègre la révocation systématique des URLs d'objets via `URL.revokeObjectURL()`. |
| **IV. Découpage Architectural Angular (Service / Smart / Dumb & CLI Exclusif)** | **PASS** | Génération exclusive via `ng generate service`, testables en isolation, sans couplage DOM direct dans les composants. |
| **V. UX Sans Friction & Lazy Authentication (Google One-Tap Différé)** | **PASS** | Aucun script Google n'est chargé au démarrage ; service différé avec fallback/mock prêt pour les actions explicites. |
| **VI. Stratégie de Tests Proportionnée (Non Négociable)** | **PASS** | Modèles en Catégorie 1 (aucun test), services d'encapsulation en Catégorie 2 (tests unitaires isolés). |

---

## Project Structure

### Documentation (this feature)

```text
specs/002-core-dependencies/
├── spec.md              # Feature specification & clarifications
├── plan.md              # This file (Implementation Plan)
├── research.md          # Technical research & technology decisions
├── data-model.md        # TypeScript models & options contracts
├── quickstart.md        # Validation & execution guide
├── contracts/           # Service interface definitions
│   └── ui-contracts.md  # QrEngineService, DomExportService, DeferredAuthService
└── checklists/
    └── requirements.md  # Specification quality checklist
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── models/
│   │   │   │   ├── palette.model.ts          # Existant (V1 Homepage)
│   │   │   │   ├── showcase.model.ts         # Existant (V1 Homepage)
│   │   │   │   ├── qr-engine.model.ts        # [NEW] QrEngineOptions, DotType, CornerType
│   │   │   │   ├── export.model.ts           # [NEW] ExportOptions, ExportResult
│   │   │   │   └── auth.model.ts             # [NEW] SocialUserProfile, AuthState
│   │   │   └── services/
│   │   │       ├── qr-engine.service.ts      # [NEW] Service CLI d'encapsulation qr-code-styling
│   │   │       ├── qr-engine.service.spec.ts # [NEW] Test unitaire Catégorie 2
│   │   │       ├── dom-export.service.ts     # [NEW] Service CLI capture html-to-image & jspdf
│   │   │       ├── dom-export.service.spec.ts# [NEW] Test unitaire Catégorie 2
│   │   │       ├── deferred-auth.service.ts  # [NEW] Service CLI authentification différée
│   │   │       └── deferred-auth.service.spec.ts # [NEW] Test unitaire Catégorie 2
│   │   └── features/
│   │       └── home/                         # Existant (Homepage intégrée)
│   ├── styles.css
│   └── index.html
└── package.json
```

**Structure Decision**: Architecture modulaire Angular sous `src/app/core/` séparant strictement les modèles de données (`models/`) et les services d'infrastructure (`services/`).

---

## Complexity Tracking

*Aucune violation constitutionnelle. Le système demeure 100% frontend in-memory.*
