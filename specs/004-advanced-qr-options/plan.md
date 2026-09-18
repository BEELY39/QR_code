# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Add advanced QR code options including a dedicated Wi-Fi configuration form, custom frames with adjustable text and fonts, dot styling ("pointillé"), client-side logo uploads, and color/gradient pickers. The implementation relies on the existing Angular frontend architecture using `qr-code-styling` for the core SVG generation.

## Technical Context

**Language/Version**: TypeScript 5.4 / Angular 18 (Standalone)

**Primary Dependencies**: `qr-code-styling` (for core QR generation and styling), Angular Forms (for Wi-Fi and styling inputs)

**Storage**: None (Pure client-side / In-Memory as per constitution)

**Testing**: Vitest for unit tests (Category 2) and integration tests (Category 3)

**Target Platform**: Web Browser (Client-side rendering, SSR-safe execution required)

**Project Type**: Web Application Frontend

**Performance Goals**: <200ms generation and preview update latency

**Constraints**: Strict client-side processing of logos (privacy), strict typing (Rust-like), no `any`

**Scale/Scope**: 1 new configuration section (Wi-Fi), 4 new visual configuration panels (Cadre, Forme, Logo, Couleurs), real-time preview updates

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Passes I. Architecture Frontend Pure & Zero-Serveur**: Yes. Logo upload and processing happens entirely via `FileReader` and Base64 conversion in memory. No backend storage.
- **Passes II. Generation Vectorielle & Integrite Visuelle**: Yes. We will use `qr-code-styling` for the custom dots, frames, and logo. Error correction will automatically be set to 'Q' or 'H' when a logo is applied.
- **Passes III. Hygiene Memoire**: Yes. We will ensure any `URL.createObjectURL` or Base64 blobs are properly managed and garbage collected when the component destroys or changes.
- **Passes IV. Decoupage Architectural Angular**: Yes. New Dumb components for the configuration forms (Wi-Fi, Styling), with the Smart component (`HomeComponent`) and `QrSimulatorService` orchestrating.
- **Passes V. UX Sans Friction**: Yes. No auth required for these configurations.
- **Passes VI. Strategie de Tests Proportionnee**: Yes. Tests will be added for the Wi-Fi formatting logic (Cat 2) and component integration (Cat 3).
- **Passes Rust-like strict typing (GEMINI.md)**: Yes. Strict models (discriminated unions) for QR payload and configuration options. No `any`.

## Project Structure

### Documentation (this feature)

```text
specs/004-advanced-qr-options/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
frontend/src/app/
├── core/
│   └── models/
│       └── live-qr.model.ts (Updates for Wi-Fi and styling options)
├── features/
│   └── home/
│       ├── data-access/
│       │   └── qr-simulator.service.ts (Logic updates for new options)
│       └── ui/
│           ├── simulator-section/
│           │   ├── simulator-section.component.ts
│           │   └── simulator-section.component.html (Tabs for new options)
│           └── qr-config-forms/ (New Dumb Components)
│               ├── wifi-form/
│               ├── frame-form/
│               ├── styling-form/
│               └── logo-form/
└── shared/
    └── ui/
        └── color-picker/ (New or reused)
```

**Structure Decision**: Expanding the existing Angular standalone structure under `frontend/src/app/features/home/ui` with specialized Dumb components to prevent the main `simulator-section` from becoming too large.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
