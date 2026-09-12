<!--
Sync Impact Report:
- Version change: Template initial -> 1.0.0
- List of modified principles:
  - [PRINCIPLE_1_NAME] -> I. Architecture Frontend Pure & Zero-Serveur (In-Memory)
  - [PRINCIPLE_2_NAME] -> II. Generation Vectorielle & Integrite Visuelle (Pur SVG & Correction Q/H)
  - [PRINCIPLE_3_NAME] -> III. Hygiene Memoire & Cycle de Vie des Blobs (Revocation Immediate)
  - [PRINCIPLE_4_NAME] -> IV. Decoupage Architectural Angular (Service / Smart / Dumb & CLI Exclusif)
  - [PRINCIPLE_5_NAME] -> V. UX Sans Friction & Lazy Authentication (Google One-Tap Differe)
- Added sections:
  - VI. Strategie de Tests Proportionnee (Non Negociable)
  - Contraintes Techniques & Bibliotheques Imposees
  - Standards d'Export & Capture DOM
- Removed sections: Aucune (remplacement complet des placeholders du template)
- Follow-up TODOs: Aucun placeholder differe
-->

# QR Code Premium Designer Constitution

## Core Principles

### I. Architecture Frontend Pure & Zero-Serveur (In-Memory)
L'application V1 fonctionne integralement en client-side dans la memoire vive (RAM) du navigateur de l'utilisateur.
- Aucun backend, aucune base de donnees et aucun stockage cloud ne sont sollicites pour la generation de QR codes en V1.
- Aucune donnee utilisateur, logo ou configuration de design ne doit quitter le navigateur sans une action explicite et consentie de sauvegarde.
- Rationale : Garantie absolue de confidentialite pour l'hotellerie de luxe, latence de generation nulle et couts d'infrastructure serveur inexistants.

### II. Generation Vectorielle & Integrite Visuelle (Pur SVG & Correction Q/H)
La generation des QR codes doit respecter des exigences esthetiques et optiques intransigeantes :
- Le rendu du QR code doit etre produit nativement en pur SVG vectoriel via `qr-code-styling`.
- Les logos importes (PNG/JPG) doivent etre convertis en Base64 et integres dans la balise native `<image>` du SVG.
- Le niveau de correction d'erreur (Error Correction Level) doit imperativement etre force a 'Q' (25%) ou 'H' (30%) des lors qu'un logo ou une personnalisation avancee (dots organiques, coins stylises) est applique.
- Rationale : Empecher la degradation de scannabilite lors de l'incrustation centrale d'un logo ou de formes non standards.

### III. Hygiene Memoire & Cycle de Vie des Blobs (Revocation Immediate)
L'accumulation d'objets en memoire browser est strictement proscrite :
- Tout blob ou URL temporaire instancie via `URL.createObjectURL()` pour la previsualisation ou le telechargement doit imperativement etre libere via `URL.revokeObjectURL()` des que le telechargement est declenche ou que le composant est detruit.
- Nettoyage systematique des subscriptions et des instances lourdes de rendu dans le cycle de vie Angular (`destroyRef` ou `ngOnDestroy`).
- Rationale : Preserver la fluidite de navigation sur mobile et eviter les fuites memoire sur les sessions prolongees d'edition de designs.

### IV. Decoupage Architectural Angular (Service / Smart / Dumb & CLI Exclusif)
Conformement aux regles fondamentales du projet, tout code Angular doit respecter le triptyque :
- **Angular CLI obligatoire** : Tout element (composant, service, pipe, directive) est genere via `ng generate` avec tests unitaires actives. Creation manuelle interdite.
- **Service (`*.service.ts`)** : Porte l'etat reactif (Signals), le moteur de configuration `qr-code-styling` et la manipulation de donnees. Agnostique du DOM.
- **Smart Component (Conteneur)** : Orchestre les ecrans, injecte les services et coordonne les actions de haut niveau (ex: declenchement d'export).
- **Dumb Component (Presentation)** : 100% visuel, recoit les inputs et emet les outputs. Interdiction d'injecter un service metier.
- Rationale : Maintenabilite a long terme, reutilisation des templates visuels et isolation testable de la logique de generation.

### V. UX Sans Friction & Lazy Authentication (Google One-Tap Differe)
Le parcours de creation et de telechargement gratuit doit rester immediat et sans barriere :
- Le SDK Google Identity / `@abacritt/angularx-social-login` ne doit **jamais** etre initialise ou declenche au chargement initial de la page.
- Le prompt d'authentification ne peut etre invoque que suite a une intention explicite et a forte valeur ajoutee de l'utilisateur (ex: clic sur "Sauvegarder ce design").
- Rationale : Maximiser le taux d'acquisition et de conversion en eliminant tout pop-up intrusif ou mur d'inscription en amont de la valeur delivree.

### VI. Strategie de Tests Proportionnee (Non Negociable)
Tout code produit est classe avant implementation dans l'une des 3 categories suivantes :
- **Categorie 1 (Aucun test)** : Dumb components purement visuels, interfaces, types, modeles de design, helpers directs sans branche conditionnelle.
- **Categorie 2 (Test Unitaire obligatoire)** : Tout service contenant la logique metier (calcul de contrastes, conversion base64, normalisation des options de styling, validation de format).
- **Categorie 3 (Test d'Integration obligatoire)** : Smart components orchestrant la capture DOM, l'export de fichiers ou le flux d'authentification differee.
- Rationale : Couvrir rigoureusement la logique critique et les frontieres d'effets de bord sans surcharger les composants de presentation purs.

## Contraintes Techniques & Bibliotheques Imposees

- **Moteur de QR Code** : `qr-code-styling` pour la generation vectorielle SVG, la personnalisation des points/yeux et l'incrustation de logo.
- **Moteur de Capture DOM & Export** : `html-to-image` pour convertir les gabarits visuels Tailwind CSS en images haute definition (PNG/SVG).
- **Authentification Sociale Differee** : `@abacritt/angularx-social-login` pour integrer de maniere asynchrone et controlee Google Sign-In dans l'ecosysteme Angular.
- **Styling & Theming** : Tailwind CSS v4 exclusivement, structure par variables de theming et classes utilitaires.

## Standards d'Implémentation & Workflow Qualité

- **Typage Strict** : Interdiction du type `any`. Tous les modeles (QR Styling options, Template presets, Export formats) doivent etre strictement types par interfaces et types TypeScript.
- **Code Production-Ready** : Pas de contournements temporaires ou de logs de debug laisses en production.
- **Accessibilite & Ergonomie** : Ratios de contraste WCAG pris en compte pour les palettes de couleurs suggerees aux clients de l'hotellerie de luxe.

## Governance

1. Cette constitution definit la loi architecturale et fonctionnelle de l'application QR Code Premium V1. Elle prevaut sur toute decision ad-hoc.
2. Tout ajout de dependance externe ou modification d'architecture (notamment l'introduction future d'un backend AdonisJS) requiert un amendement constitutionnel prealable.
3. Chaque revue de specification (`/speckit-specify`), de plan (`/speckit-plan`) et de code doit verifier la stricte conformite avec les 6 principes cardinaux.

**Version**: 1.0.0 | **Ratified**: 2026-09-12 | **Last Amended**: 2026-09-12
