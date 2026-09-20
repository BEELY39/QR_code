# Feature Specification: Génération de QR Code Réel en Direct (Live Simulator)

**Feature Branch**: `003-live-qr-generator`

**Created**: 2026-09-13

**Status**: Draft

**Input**: User description: "alors actuellement on a installé tous les dépendances maintenant on va commencer à faire le premier sprint c'est à dire la génération de QR code c'est à dire là actuellement dans notre héros il est bien dans notre page d'accueil il est bien et quand on va à la deuxième section on voit là où on peut créer notre propre QR code en direct alors là actuellement ce qu'on va faire c'est qu'on va vraiment générer un vrai QR code parce que actuellement c'est juste une image d'illustration et du coup je te laisse carte libre pour me faire pour me faire l'implémentation du QR code mais carte libre pour l'implémentation pas pour pour modifier le design en soi pour remodifier le design mettre le l'endroit où le qr code il est généré autre part là aussi tu vois ce que je veux dire mais donc actuellement je te laisse carte libre pour la génération de QR code me faire déjà la première feature c'est à dire quand on met un lien ça génère un qr code quand on met un texte quand on met un texte aussi ça génère un QR code en fait il y aura deux boutons pour switch soit soit tu veux faire un texte soit tu veux faire un lien et du coup voilà et aussi au milieu il doit avoir un au milieu d'avoir un logo même si comme le logo qui est actuellement là présent QR avec un rond et en même temps tu vas comment dire tu vas mettre à 30% le 30% je sais plus comment s'appelle le truc d'erreur mais voilà c'est ça que je voulais que tu me fasses"

---

## Contexte & Objectifs

Dans la version actuelle de la page d'accueil, la section simulateur ("Simulateur Express") utilise une illustration SVG statique dont seules les couleurs de fond et le texte inférieur s'ajustent. 

L'objectif de cette fonctionnalité est de transformer ce simulateur en un **véritable moteur de génération vectorielle en direct** :
1. Remplacer l'illustration factice par un **vrai QR code scannable au smartphone**, généré nativement via `QrEngineService` (`qr-code-styling`).
2. Conserver strictement le design pixel-perfect et l'emplacement exact de la carte simulateur.
3. Proposer un commutateur ergonomique à 2 options : **Lien (URL)** ou **Texte brut**.
4. Intégrer un **logo circulaire central** (badge monogramme QRCraft).
5. Forcer le niveau de correction d'erreur (Error Correction Level) à **'H' (30%)** pour garantir une tolérance optique maximale.
6. Respecter la **Règle n°5 de `GEMINI.md` : Typage Fort et Exhaustif « à la Rust »** (unions discriminées, `readonly`, exhaustiveness checking avec `never`, zéro `any`).

---

## Clarifications

### Clarification 1: Format et Stockage du Logo Circulaire Central
- **Question:** Sous quelle forme technique souhaitez-vous intégrer le logo circulaire central dans le QR code généré ?
- **Clarification:** Option A retenue — Le logo central est un badge vectoriel SVG circulaire (monogramme QRCraft) encodé directement en Data URL Base64 in-memory, garantissant 0 requête réseau et une netteté vectorielle parfaite à toute échelle.
- **Impact on Requirements:** Confirmation de FR-004 : l'image centrale est une ressource Base64 vectorielle autonome injectée dans `QrEngineOptions.image`.

### Clarification 2: Réactivité de Saisie et Debounce
- **Question:** Quelle stratégie de réactivité souhaitez-vous appliquer lors de la saisie d'un texte ou d'une URL au clavier pour mettre à jour le QR code ?
- **Clarification:** Option A retenue — Application d'un debounce court de 150 ms sur la saisie textuelle pour concilier fluidité optique maximale et réactivité perçue instantanée.
- **Impact on Requirements:** Ajout de l'exigence fonctionnelle FR-010 précisant le debounce de 150 ms sur les flux d'entrées du simulateur.

---

## Modélisation Rust-like des États & Données

Conformément à la Règle n°5 de `GEMINI.md`, aucun état illégal ne peut exister.

```typescript
/** Mode de saisie sélectionné */
export type InputMode = 'url' | 'text';

/** Union discriminée modélisant le contenu du QR Code */
export type QrPayload =
  | { readonly kind: 'url'; readonly rawUrl: string; readonly targetUrl: string }
  | { readonly kind: 'text'; readonly content: string };

/** Union discriminée modélisant le cycle de rendu du générateur */
export type GeneratorStatus =
  | { readonly kind: 'idle' }
  | { readonly kind: 'generating' }
  | { readonly kind: 'ready'; readonly svgMarkup: string }
  | { readonly kind: 'error'; readonly errorMessage: string };
```

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Rendu Vectoriel d'un Vrai QR Code Scannable avec Logo & ECL 30% (Priority: P1) 🎯 MVP

En tant que visiteur ou client hôtelier sur la page d'accueil, je souhaite que le QR code affiché dans le simulateur soit un véritable QR code vectoriel généré à la volée, avec un logo circulaire au centre et une correction d'erreur à 30% ('H'), afin de pouvoir le scanner immédiatement avec mon smartphone.

**Why this priority**: C'est la proposition de valeur centrale de l'application : prouver la puissance et la beauté de nos QR codes dès la première visite.

**Independent Test**: Pointer la caméra d'un smartphone sur l'écran : le QR code est instantanément reconnu et ouvre l'URL saisie.

**Acceptance Scenarios**:
1. **Given** la page d'accueil chargée dans le navigateur, **When** le simulateur s'affiche, **Then** un vrai QR code vectoriel SVG est généré avec un logo circulaire au centre.
2. **Given** le QR code généré, **When** on inspecte ses paramètres optiques, **Then** le niveau de correction d'erreur est strictement configuré à `'H'` (30% de redondance).
3. **Given** le QR code généré, **When** on le scanne avec un smartphone, **Then** il est lu sans délai ni erreur de lecture.

---

### User Story 2 - Bascule Interactive entre Mode "Lien" et Mode "Texte" (Priority: P2)

En tant qu'utilisateur créateur de QR code, je souhaite basculer facilement entre la création d'un QR code pour un lien web (menu, Instagram, site) et un QR code pour du texte brut (code Wi-Fi, message de bienvenue, mot de passe), via deux boutons bien visibles.

**Why this priority**: L'hôtellerie utilise fréquemment les QR codes pour les réseaux Wi-Fi de chambre et les consignes textuelles, en plus des liens de menus.

**Independent Test**: Cliquer sur "Texte", saisir `Wi-Fi: Hotel-Luxury-Guest`, vérifier que le QR code met à jour ses modules immédiatement et que le scan restitue le texte exact.

**Acceptance Scenarios**:
1. **Given** le formulaire du simulateur, **When** l'utilisateur clique sur le bouton "Texte", **Then** le champ de saisie s'adapte (placeholder adapté à un message/code) et le mode passe à `text`.
2. **Given** le mode "Lien" actif, **When** l'utilisateur saisit `palace-paris.com`, **Then** l'URL est automatiquement normalisée en `https://palace-paris.com` pour garantir la scannabilité.
3. **Given** une modification du texte ou du lien, **When** la saisie change, **Then** le QR code est recalculé en direct de façon réactive (< 50ms).

---

### User Story 3 - Personnalisation Chromatique & Export du QR Code Réel (Priority: P3)

En tant qu'utilisateur, je souhaite que la sélection des palettes de couleurs (Violet Pop, Menthe Fraîche, Sunset Coral, Cyan Électrique) et la saisie du texte inférieur mettent à jour l'apparence du QR code réel et que le bouton de téléchargement télécharge le vrai QR code.

**Why this priority**: Permet à l'utilisateur de tester la cohérence visuelle avec son image de marque avant de commander ou d'utiliser le studio complet.

**Independent Test**: Sélectionner la palette "Menthe Fraîche" et cliquer sur "Télécharger" : le fichier SVG/PNG téléchargé contient le QR code réel avec le dégradé menthe et le logo central.

**Acceptance Scenarios**:
1. **Given** une palette de couleur sélectionnée, **When** l'utilisateur clique dessus, **Then** les motifs du QR code s'affichent avec le dégradé correspondant.
2. **Given** le simulateur avec un QR code actif, **When** l'utilisateur clique sur le bouton de téléchargement, **Then** le fichier vectoriel SVG réel est téléchargé.

---

## Edge Cases

- **Texte ou URL vide** : Si le champ est vidé par l'utilisateur, le générateur doit afficher un QR code de repli élégant (URL par défaut) pour éviter un écran blanc ou un crash du moteur.
- **Caractères spéciaux et encodage UTF-8** : Les caractères accentués, emojis (ex: ✨) et symboles Wi-Fi doivent être encodés sans corruption en mode Texte.
- **Rendu côté serveur (SSR)** : Sur le serveur Express / Node.js, `QrEngineService` applique sa garde `isPlatformBrowser()` pour éviter toute tentative d'accès à `document` ou `<canvas>` et fournir un balisage SVG statique défensif.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le simulateur DOIT intégrer un commutateur à 2 boutons stylisés (`Lien` / `Texte`) pour définir le type de contenu du QR code.
- **FR-002**: Le système DOIT générer un véritable QR code vectoriel SVG scannable via `QrEngineService` et `qr-code-styling`.
- **FR-003**: Le niveau de correction d'erreur (ECL) du QR code DOIT être impérativement fixé à `'H'` (High / 30% de redondance).
- **FR-004**: Un logo circulaire (monogramme QR / icône de réassurance) DOIT être incrusté au centre du QR code avec masquage des points sous-jacents (`hideBackgroundDots: true`).
- **FR-005**: En mode `url`, le système DOIT ajouter automatiquement le protocole `https://` si l'utilisateur saisit un domaine simple (ex: `bistro-paris.fr`).
- **FR-006**: En mode `text`, le système DOIT encoder fidèlement l'intégralité de la chaîne textuelle brute.
- **FR-007**: Le design, la typographie *Plus Jakarta Sans*, les espacements et l'agencement responsive de la carte simulateur DOIVENT être strictement préservés à l'identique de la maquette.
- **FR-008**: Le modèle de données DOIT respecter le **Typage Fort « à la Rust »** (Règle n°5 de `GEMINI.md`) via des unions discriminées (`QrPayload`, `GeneratorStatus`), des propriétés `readonly`, et un aiguillage exhaustif avec contrôle `never`.
- **FR-009**: Le bouton d'action principal de la carte simulateur DOIT permettre de télécharger le fichier SVG vectoriel réel généré.
- **FR-010**: La saisie clavier dans le champ de contenu DOIT être régulée par un debounce court de 150 ms afin de préserver une fluidité optique sans saccade lors du recalcul des modules vectoriels.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Le QR code affiché à l'écran est immédiatement scannable par un smartphone en moins d'une seconde.
- **SC-002**: Le basculement entre le mode "Lien" et "Texte" s'opère en moins de 50 millisecondes sans rechargement de page.
- **SC-003**: L'Error Correction Level est certifié à 30% ('H'), garantissant une tolérance optique parfaite malgré le logo central.
- **SC-004**: La suite de tests Vitest (unitaires Catégorie 2 et intégration Catégorie 3) passe à 100% avec zéro régression.
- **SC-005**: Le build de production avec SSR (`npm run build`) passe avec zéro erreur et zéro warning.
