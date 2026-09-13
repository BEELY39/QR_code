# Implementation Plan: Générateur de QR Code Réel en Direct (Live Simulator)

**Branch**: `003-live-qr-generator` | **Date**: 2026-09-13 | **Spec**: [specs/003-live-qr-generator/spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-live-qr-generator/spec.md`

## Summary

Cette fonctionnalité transforme le simulateur visuel de la page d'accueil en un véritable générateur de QR code vectoriel interactif et scannable :
1. Remplacement de l'illustration statique par un rendu SVG pur généré en temps réel via `QrEngineService` (`qr-code-styling`).
2. Esthétique de luxe non négociable (zéro noir et blanc) : coins extérieurs adoucis (`extra-rounded`), points centraux d'yeux circulaires (`dot`), modules arrondis (`rounded`), et dégradés linéaires à 45° synchronisés sur la palette active.
3. Incrustation d'un badge monogramme vectoriel QRCraft au centre avec masque de dégagement (`hideBackgroundDots: true`).
4. Correction d'erreur optique fixée à 30% ('H').
5. Commutateur ergonomique à 2 boutons (Lien / Texte) avec normalisation d'URL et debounce de 150 ms.
6. Téléchargement direct du fichier vectoriel SVG via le bouton d'action.
7. Respect strict de la **Règle n°5 de `GEMINI.md` : Typage Fort & Exhaustif « à la Rust »** (unions discriminées, `readonly`, exhaustiveness checking avec `never`, zéro `any`).

---

## Technical Context

**Language/Version**: TypeScript ~5.9.2 / Angular 21.0.4

**Primary Dependencies**: `qr-code-styling` (^1.9.2), `QrEngineService`, Tailwind CSS v4

**Storage**: In-Memory / Local Browser RAM uniquement (0 backend, 0 stockage cloud)

**Testing**: Vitest 4.0.8, JSDOM, Angular TestBed (Tests unitaires Catégorie 2 & Intégration Catégorie 3)

**Target Platform**: Navigateurs web modernes + Node.js pour le SSR Angular Universal

**Project Type**: Application Web Frontend avec Server-Side Rendering (SSR)

**Performance Goals**: Recalcul SVG < 50ms, Debounce fluide 150ms, Scan smartphone < 1s

**Constraints**: Bords arrondis, aucun noir/blanc brut, ECL forcé à 'H' (30%), typage strict "à la Rust"

**Scale/Scope**: Section simulateur d'accueil, 1 service réactif mis à jour, 1 composant de présentation enrichi

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principe Constitutionnel | Statut | Justification |
| :--- | :---: | :--- |
| **I. Architecture Frontend Pure & Zéro-Serveur (In-Memory)** | **PASS** | Tout le calcul optique s'exécute dans la mémoire vive (RAM) du navigateur. Zéro appel serveur. |
| **II. Génération Vectorielle & Intégrité Visuelle (SVG & Correction Q/H)** | **PASS** | Rendu SVG vectoriel natif avec `qr-code-styling`. ECL forcé à 'H' (30%) pour compenser le logo central. |
| **III. Hygiène Mémoire & Cycle de Vie des Blobs** | **PASS** | Les URLs Blob générées pour l'export SVG sont immédiatement libérées via `URL.revokeObjectURL()`. |
| **IV. Découpage Architectural Angular (Service / Smart / Dumb & CLI Exclusif)** | **PASS** | Découpage strict : `QrSimulatorService` (logique et état réactif) / `HomeComponent` (Smart conteneur) / `SimulatorSectionComponent` (Dumb 100% visuel). |
| **V. UX Sans Friction & Lazy Authentication** | **PASS** | Génération instantanée et libre sans aucun formulaire de blocage ni pop-up d'inscription. |
| **VI. Stratégie de Tests Proportionnée (Non Négociable)** | **PASS** | Modèles et constantes en Catégorie 1 (aucun test), `QrSimulatorService` en Catégorie 2 (test unitaire), `HomeComponent` en Catégorie 3 (test d'intégration). |

---

## Project Structure

### Documentation (this feature)

```text
specs/003-live-qr-generator/
├── spec.md              # Spécification détaillée
├── plan.md              # Ce document (Plan d'implémentation)
├── research.md          # Décisions techniques & esthétiques
├── data-model.md        # Modèles TypeScript Rust-like & unions discriminées
├── quickstart.md        # Guide de test et validation smartphone
├── contracts/
│   └── ui-contracts.md  # Contrats des composants et services
└── checklists/
    └── requirements.md  # Checklist qualité
```

### Source Code (repository root)

```text
frontend/src/app/
├── core/
│   ├── constants/
│   │   └── qr-logo.constant.ts                  # [NEW] Badge vectoriel circulaire QRCraft Base64
│   ├── models/
│   │   └── live-qr.model.ts                     # [NEW] Unions discriminées QrPayload & GeneratorStatus
│   └── services/
│       └── qr-engine.service.ts                 # Existant (moteur vectoriel sécurisé SSR)
└── features/
    └── home/
        ├── data-access/
        │   ├── qr-simulator.service.ts          # [MODIFY] Intégration mode Lien/Texte, ECL 'H', logo & SVG live
        │   └── qr-simulator.service.spec.ts     # [MODIFY] Tests unitaires exhaustifs (Catégorie 2)
        ├── home.component.ts                    # [MODIFY] Transmission du SVG live et du handler d'export
        ├── home.component.html                  # [MODIFY] Bindings des nouvelles entrées/sorties
        ├── home.component.spec.ts               # [MODIFY] Test d'intégration (Catégorie 3)
        └── ui/
            └── simulator-section/
                ├── simulator-section.component.ts   # [MODIFY] Entrées/sorties typées pour le mode et le SVG
                ├── simulator-section.component.html # [MODIFY] Onglets Lien/Texte & conteneur SVG injecté
                └── simulator-section.component.css  # [MODIFY] Transitions et arrondis raffinés
```

---

## Complexity Tracking

*Aucune violation constitutionnelle. Le système demeure 100% frontend in-memory et respecte le standard de typage fort à la Rust.*
