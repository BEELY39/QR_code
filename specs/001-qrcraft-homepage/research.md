# Phase 0 Research: Intégration de la Page d'Accueil QRCraft (Pixel Perfect)

## Contexte & Objectifs de Recherche

L'objectif est d'intégrer la maquette fournie dans `modul_teste/` (`screen.png`, `DESIGN.md`, `code.html`) à la racine de l'application Angular 21 tout en respectant scrupuleusement la constitution du projet et les règles globales `GEMINI.md` :
1. Découpage strict **Service / Smart Component / Dumb Component**.
2. **Angular CLI** comme seul maître pour générer la structure (`ng generate`).
3. Stratégie de tests proportionnée (Catégorie 1 : présentation pure / Catégorie 2 : tests unitaires / Catégorie 3 : tests d'intégration).
4. Intégration des tokens visuels (Design System) dans Tailwind CSS v4.

---

## Décision 1 : Intégration des Tokens Design System (Tailwind CSS v4)

- **Décision** : Configurer la palette de couleurs, typographies (Plus Jakarta Sans) et espacements du fichier `DESIGN.md` directement dans le fichier `frontend/src/styles.css` via la directive native `@theme` de Tailwind CSS v4.
- **Rationale** : Tailwind CSS v4 élimine le fichier `tailwind.config.js` classique au profit d'une configuration déclarative en CSS `@theme { --color-primary: ...; --font-headline-xl: ...; }`. Cela assure des performances de compilation optimales avec `@angular/build` et une compatibilité pixel-perfect avec la maquette `code.html`.
- **Alternatives considérées** :
  - Conserver un `tailwind.config.js` hérité : Rejeté car Tailwind CSS v4 favorise la directive CSS `@theme` et évite les doubles définitions.
  - Utiliser des classes Tailwind brutes avec valeurs arbitraires (`bg-[#412ce7]`) : Rejeté car cela disperse les tokens et nuit à la maintenabilité.

---

## Décision 2 : Découpage Architectural Angular (Service / Smart / Dumb)

- **Décision** : 
  - **Service Métier (`QrSimulatorService`)** : Gère l'état réactif (Signals) du simulateur express : texte/URL saisi, palette chromatique sélectionnée, texte du bandeau inférieur.
  - **Smart Component (`HomeComponent`)** : Composant conteneur associé à la route `/`. Il injecte `QrSimulatorService` et orchestre la vue en assemblant les composants enfants.
  - **Dumb Components (Présentation pure)** :
    - `NavbarComponent` : Barre de navigation supérieure glassmorphism.
    - `HeroSectionComponent` : Titre, promesses, badges de réassurance et mockup bistro.
    - `SimulatorSectionComponent` : Formulaire du simulateur et carte d'aperçu dynamique (bindings purs `@Input()` / `@Output()`).
    - `FeaturesSectionComponent` : Grille des 4 atouts produit ("Ingénierie & Esthétique").
    - `ShowcaseSectionComponent` : Galerie des 4 cas réels (Hospitality, Réseaux, vCard, Restauration).
    - `CtaBannerComponent` : Bannière d'engagement de fin de page.
    - `FooterComponent` : Liens institutionnels, légaux et badge de disponibilité.
- **Rationale** : Respecte à 100% la Règle n°2 de `GEMINI.md`. Aucun composant de présentation n'injecte de service métier, et le Smart Component reste fin.
- **Alternatives considérées** :
  - Tout coder dans `AppComponent` ou un composant monolithique : Strictement proscrit par `GEMINI.md`.

---

## Décision 3 : Classification des Tests et Stratégie d'Assurance Qualité

- **Décision** :
  - **Catégorie 1 (Aucun test requis)** :
    - `NavbarComponent`, `HeroSectionComponent`, `FeaturesSectionComponent`, `ShowcaseSectionComponent`, `CtaBannerComponent`, `FooterComponent` : Dumb components 100% visuels sans logique conditionnelle ni calcul.
    - Interfaces et types TypeScript (`palette.model.ts`, `showcase.model.ts`).
  - **Catégorie 2 (Test Unitaire obligatoire)** :
    - `QrSimulatorService` : Test unitaire isolé sous Vitest pour vérifier l'état initial des signaux, le changement de palette, la mise à jour des textes et la normalisation des valeurs d'encodage.
  - **Catégorie 3 (Test d'Intégration obligatoire)** :
    - `HomeComponent` : Test d'intégration de l'orchestration du simulateur (la saisie dans le formulaire met à jour la carte d'aperçu via le service).
- **Rationale** : Application stricte de la Règle n°4 de `GEMINI.md` : pas de gaspillage sur les composants purement visuels, couverture rigoureuse sur la logique métier et l'orchestration.

---

## Décision 4 : Chargement des Polices et Icônes

- **Décision** : Importer la police Google Fonts *Plus Jakarta Sans* et les icônes *Material Symbols Outlined* dans `frontend/src/index.html`.
- **Rationale** : La maquette spécifie la police Plus Jakarta Sans (graisses 400 à 800) et les icônes Material Symbols (fill variable) pour restituer l'identité visuelle de manière pixel-perfect.
