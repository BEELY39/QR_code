# Feature Specification: Installation et Configuration des Dépendances Cœur (V1)

**Feature Branch**: `002-core-dependencies`

**Created**: 2026-09-13

**Status**: Draft

**Input**: User description: "Alors actuellement je vais installer toutes les dépendances qui me sont nécessaires dans cette application. Du coup, dans un premier temps, tu vas lancer le serveur, mais tu vas regarder notre plan, notre application, comment il va être, et tu vas récupérer toutes les dépendances. Toutes les dépendances que j'aurai besoin d'utiliser."

## Contexte et Alignement Constitutionnel

Conformément à la [Constitution du projet](../../.specify/memory/constitution.md) et aux spécifications techniques V1 du générateur Designer QR pour l'hôtellerie et la restauration de luxe, l'application fonctionne avec une **architecture purement frontend (in-memory/zéro-serveur)**.

L'objectif de cette spécification est d'identifier, recenser, installer et valider l'ensemble des bibliothèques nécessaires à la réalisation de la V1, en garantissant la compatibilité avec Angular 21, Tailwind CSS v4 et le rendu SSR (Server-Side Rendering).

---

## Clarifications

### Clarification 1: Isolation SSR des Dépendances DOM
- **Question:** Comment souhaitez-vous sécuriser l'utilisation des bibliothèques manipulant le DOM (`qr-code-styling`, `html-to-image`, `jspdf`) vis-à-vis du moteur Server-Side Rendering (SSR) d'Angular 21 ?
- **Clarification:** Option A retenue — Les bibliothèques manipulant le DOM seront encapsulées dans des services dédiés vérifiant `isPlatformBrowser(this.platformId)` et utilisant des imports asynchrones dynamiques côté client.
- **Impact on Requirements:** Ajout de l'exigence fonctionnelle FR-008 imposant la protection défensive `isPlatformBrowser()` sur tout appel aux API DOM de ces packages.

### Clarification 2: Initialisation Différée de l'Authentification Sociale
- **Question:** Comment souhaitez-vous initialiser `@abacritt/angularx-social-login` (Google Sign-In) dans la configuration de l'application (`app.config.ts`) sans bloquer le démarrage si aucun `clientId` Google n'est encore renseigné ?
- **Clarification:** Option A retenue — Le package est installé, et un service d'authentification différé avec fallback/mock sera préparé sans charger de script externe distant tant qu'un Client ID valide n'est pas renseigné.
- **Impact on Requirements:** Ajout de l'exigence fonctionnelle FR-009 garantissant qu'aucune requête externe Google n'est initiée au démarrage.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Intégration du Moteur de Génération Vectorielle QR Code (Priority: P1) 🎯 MVP

En tant que développeur de l'application QRCraft, je souhaite installer et configurer le moteur de rendu de QR codes vectoriels (`qr-code-styling`) afin de pouvoir générer des QR codes haute définition avec personnalisation des points, des coins et incrustation centrale de logo sans régression optique.

**Why this priority**: C'est le cœur métier de l'application. Sans ce moteur, aucune génération de QR code personnalisé n'est possible.

**Independent Test**: La bibliothèque s'importe sans erreur dans l'écosystème Angular 21 et permet d'instancier un QR code vectoriel SVG avec correction d'erreur 'Q' ou 'H'.

**Acceptance Scenarios**:
1. **Given** un environnement Angular 21, **When** `qr-code-styling` est installé, **Then** les types TypeScript et la classe de rendu sont résolus sans erreur de compilation.
2. **Given** une génération de QR code avec incrustation de logo, **When** le moteur est invoqué, **Then** il supporte l'injection du logo en Base64 dans la balise SVG native.

---

### User Story 2 - Intégration des Moteurs d'Export et Capture Visuelle Haute Résolution (Priority: P2)

En tant qu'utilisateur de l'hôtellerie de luxe, je souhaite pouvoir exporter mes designs et gabarits de présentation (chevalets de table, menus, stickers vitrines) en images haute fidélité (PNG @2x/@3x, 300 DPI) et en documents PDF prêts pour l'impression physique.

**Why this priority**: L'hôtellerie haut de gamme exige des supports physiques impeccables pour les tables, suites et comptoirs.

**Independent Test**: Les bibliothèques `html-to-image` et `jspdf` s'installent et permettent de capturer un élément DOM Tailwind pour générer un flux d'image ou un document PDF téléchargeable.

**Acceptance Scenarios**:
1. **Given** un gabarit visuel DOM stylisé avec Tailwind CSS v4, **When** `html-to-image` est invoqué, **Then** il produit un Data URL PNG net à l'échelle demandée sans altérer les polices web.
2. **Given** une demande d'export imprimable pour un chevalet ou un flyer, **When** `jspdf` est exécuté côté client, **Then** un document PDF vectoriel haute définition est généré in-memory.

---

### User Story 3 - Infrastructure d'Authentification Sociale Différée (Priority: P3)

En tant qu'utilisateur créateur de QR code, je souhaite pouvoir bénéficier ultérieurement d'une authentification Google One-Tap fluide et non intrusive lorsque je décide explicitement de sauvegarder mon travail.

**Why this priority**: Conforme au principe constitutionnel V (UX sans friction & Lazy Authentication), préparant l'intégration sans pop-up intempestif au chargement.

**Independent Test**: La bibliothèque `@abacritt/angularx-social-login` est installée et configurable de manière différée (lazy-loaded) sans bloquer l'initialisation de l'application.

**Acceptance Scenarios**:
1. **Given** l'application en cours d'exécution, **When** la page d'accueil se charge, **Then** aucun appel externe Google ni prompt One-Tap n'est déclenché automatiquement.
2. **Given** une action utilisateur volontaire de sauvegarde, **When** le module social est sollicité, **Then** le flux d'authentification peut être déclenché à la demande.

---

## Edge Cases

- **Compatibilité SSR (Angular Universal / Server Engine)** : Les bibliothèques manipulant le DOM (`qr-code-styling`, `html-to-image`, `jspdf`) accèdent aux objets `window`, `document` ou `canvas`. Elles doivent être protégées par des guards défensifs (`isPlatformBrowser()`) pour ne pas faire crasher le rendu côté serveur.
- **Résolution des types TypeScript** : Toutes les bibliothèques doivent exposer des types stricts ou disposer de packages `@types/*` pour respecter la règle "zéro any".
- **Cycle de vie des Blobs en mémoire** : Les exports d'images et PDF doivent respecter le principe constitutionnel III (révocation immédiate via `URL.revokeObjectURL()`).

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le système DOIT inclure `qr-code-styling` pour la génération vectorielle de QR codes (SVG natif, dots arrondis/carrés, corners personnalisés, gradients, ECL Q/H).
- **FR-002**: Le système DOIT inclure `html-to-image` pour la capture DOM haute résolution des templates hôteliers (chevalets de table, menus, stickers).
- **FR-003**: Le système DOIT inclure `jspdf` pour la production de fichiers PDF vectoriels haute fidélité destinés à l'impression physique.
- **FR-004**: Le système DOIT inclure `@abacritt/angularx-social-login` pour la gestion de l'authentification Google One-Tap différée.
- **FR-005**: L'installation de l'ensemble des dépendances NE DOIT générer aucun conflit de peer-dependencies avec Angular 21.
- **FR-006**: La suite de tests Vitest existante (`npm test`) DOIT demeurer à 100% au vert après installation.
- **FR-007**: La compilation de production complète avec SSR (`npm run build`) DOIT s'exécuter avec succès.
- **FR-008**: Les services d'encapsulation utilisant `qr-code-styling`, `html-to-image` et `jspdf` DOIVENT intégrer une garde d'exécution `isPlatformBrowser(PLATFORM_ID)` avec chargement dynamique asynchrone côté client afin de garantir 100% de tolérance aux pannes du moteur SSR / Prerendering.
- **FR-009**: L'intégration de `@abacritt/angularx-social-login` DOIT être configurée avec un fallback défensif (service d'authentification différé et Client ID mock/placeholder non bloquant) afin qu'aucun script externe ne soit sollicité tant qu'un Client ID valide n'est pas fourni.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `npm install` s'exécute avec succès (code de retour 0) en ajoutant les 4 dépendances clés dans `package.json`.
- **SC-002**: La totalité des 17 tests Vitest actuels continue de passer avec 100% de succès.
- **SC-003**: Le build de production client et SSR (`npm run build`) se termine sans erreur de typage ni warning bloquant.
- **SC-004**: Le serveur de développement Angular continue de tourner et de servir la page d'accueil sans latence ni crash.

---

## Assumptions & Planification Technique

- Toutes les manipulations de capture et de génération de fichiers se déroulent strictement côté client (in-memory) conformément à la Constitution V1.
- Aucun backend AdonisJS n'est requis à ce stade.
