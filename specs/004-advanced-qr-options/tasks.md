# Tâches d'implémentation : 004-advanced-qr-options

## Phase 1 : Configuration (Infrastructure partagée)

**Objectif** : Initialisation et vérifications de base

- [X] T001 Vérifier que la version de la bibliothèque `qr-code-styling` dans `package.json` supporte toutes les options requises (points, dégradés, cadres)

---

## Phase 2 : Fondations (Prérequis bloquants)

**Objectif** : Infrastructure de base qui DOIT être terminée avant de commencer les User Stories

**🛑 CRITIQUE** : Aucun travail sur les User Stories ne peut commencer tant que cette phase n'est pas terminée

- [X] T002 Mettre à jour `QrPayload` dans `frontend/src/app/core/models/live-qr.model.ts` pour inclure le type d'union discriminée `WifiConfig`
- [X] T003 Mettre à jour `frontend/src/app/core/models/live-qr.model.ts` pour inclure les interfaces strictes `QrColorOptions`, `QrFrameOptions` et `QrDesignOptions`
- [X] T004 Mettre à jour `QrSimulatorState` dans `frontend/src/app/features/home/data-access/qr-simulator.service.ts` pour intégrer le nouvel état `QrDesignOptions`

**Point de contrôle** : Les fondations sont prêtes - l'implémentation des User Stories peut commencer

---

## Phase 3 : User Story 1 - Configuration Wi-Fi (Priorité : P1) ⭐ MVP

**Objectif** : Permettre aux utilisateurs de générer des QR codes pour se connecter au Wi-Fi.

**Test indépendant** : Peut être entièrement testé en sélectionnant le mode Wi-Fi, en remplissant les identifiants et en vérifiant que le QR code connecte un appareil mobile.

### Tests pour la User Story 1 🎯

- [X] T005 [P] [US1] Créer les tests unitaires pour le formateur de charge utile Wi-Fi dans `frontend/src/app/core/utils/wifi-formatter.spec.ts` (Catégorie 2)

### Implémentation pour la User Story 1

- [X] T006 [P] [US1] Implémenter la fonction utilitaire `formatWifiPayload` dans `frontend/src/app/core/utils/wifi-formatter.ts`
- [X] T007 [US1] Générer le Dumb Component `wifi-form` via Angular CLI : `ng g c features/home/ui/qr-config-forms/wifi-form --standalone`
- [X] T008 [US1] Implémenter le HTML et la logique de `wifi-form` (Reactive Forms : SSID, Chiffrement, Mot de passe, Masqué) dans `frontend/src/app/features/home/ui/qr-config-forms/wifi-form/wifi-form.component.ts`
- [X] T009 [US1] Intégrer l'onglet `wifi-form` dans `frontend/src/app/features/home/ui/simulator-section/simulator-section.component.html`
- [X] T010 [US1] Mettre à jour `qr-simulator.service.ts` pour gérer la génération de la charge utile Wi-Fi et la transmettre au moteur QR

**Point de contrôle** : À ce stade, la User Story 1 est entièrement fonctionnelle et testable de manière indépendante

---

## Phase 4 : User Story 2 - Personnalisation de l'apparence (Cadres et Formes) (Priorité : P2)

**Objectif** : Permettre aux utilisateurs d'appliquer des cadres personnalisés et de modifier la forme des points.

### Implémentation pour la User Story 2

- [X] T011 [P] [US2] Générer le composant `frame-form` via Angular CLI : `ng g c features/home/ui/qr-config-forms/frame-form --standalone`
- [X] T012 [P] [US2] Générer le composant `styling-form` via Angular CLI : `ng g c features/home/ui/qr-config-forms/styling-form --standalone`
- [X] T013 [US2] Implémenter la logique et le HTML de `frame-form` (sélection de cadre, texte, police) dans `frontend/src/app/features/home/ui/qr-config-forms/frame-form/frame-form.component.ts`
- [X] T014 [US2] Implémenter la logique et le HTML de `styling-form` (sélection du style de points) dans `frontend/src/app/features/home/ui/qr-config-forms/styling-form/styling-form.component.ts`
- [X] T015 [US2] Intégrer `frame-form` et `styling-form` dans `simulator-section.component.html` et gérer les événements de design
- [X] T016 [US2] Mettre à jour l'UI de `simulator-section.component` pour envelopper le SVG généré dans un conteneur de cadre HTML/CSS avec texte personnalisé et Google Fonts

**Point de contrôle** : À ce stade, les User Stories 1 ET 2 fonctionnent toutes deux de manière indépendante

---

## Phase 5 : User Story 3 - Ajout de Logos et Couleurs Personnalisés (Priorité : P2)

**Objectif** : Permettre aux utilisateurs d'uploader des logos personnalisés et d'appliquer des couleurs unies/dégradées.

### Implémentation pour la User Story 3

- [X] T017 [P] [US3] Générer le composant `logo-form` via Angular CLI : `ng g c features/home/ui/qr-config-forms/logo-form --standalone`
- [X] T018 [P] [US3] Générer le composant `colors-form` via Angular CLI : `ng g c features/home/ui/qr-config-forms/colors-form --standalone`
- [X] T019 [US3] Implémenter le composant `logo-form` (input file, conversion FileReader Base64) dans `frontend/src/app/features/home/ui/qr-config-forms/logo-form/logo-form.component.ts`
- [X] T020 [US3] Implémenter le composant `colors-form` (dégradés unis, linéaires, radiaux) dans `frontend/src/app/features/home/ui/qr-config-forms/colors-form/colors-form.component.ts`
- [X] T021 [US3] Intégrer `logo-form` et `colors-form` dans `simulator-section.component.html` avec navigation par onglets dédiés
- [X] T022 [US3] Mettre à jour `qr-simulator.service.ts` pour injecter le Base64 du logo et les configurations de couleurs dans le moteur QR

**Point de contrôle** : Toutes les user stories sont maintenant fonctionnelles de manière indépendante

---

## Phase 6 : Finitions (Polish)

**Objectif** : Améliorations transversales et validation finale

- [X] T023 Mettre à jour les tests d'intégration pour `HomeComponent` (Smart) dans `frontend/src/app/features/home/home.component.spec.ts` pour couvrir le Wi-Fi et les options de design (Catégorie 3)
- [X] T024 Nettoyage du code (garantir des typages stricts, zéro `any`, respect strict des standards Rust-like)
- [X] T025 Exécuter le flux de validation manuel de `quickstart.md`
