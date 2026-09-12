# Feature Specification: Intégration de la Page d'Accueil QRCraft (Pixel Perfect)

**Feature Branch**: `001-qrcraft-homepage`

**Created**: 2026-09-12

**Status**: Clarified

**Input**: User description: "Alors dans module test, dans le deuxième module test à la racine de notre projet, j'ai mis la maquette. Je te laisse voir la maquette et me directement me configurer me l'intégrer pixel perfect. En fait la maquette, elle doit être directement quand on arrive dans le site dans la home page. Du coup ce que tu vas faire c'est directement tu vas la mettre la maquette doit être à la racine, c'est-à-dire quand je vais dans localhost, c'est la maquette, je dois voir en premier. Du coup je te laisse l'intégrer en pixel perfect. Je l'ai généré avec Google, ça a l'air très bien, du coup je te laisse me l'intégrer."

## Clarifications

### Session 2026-09-12
- Q: Vers où doivent diriger les boutons d'appel à l'action principaux du Studio ("Créer mon premier QR Code gratuit", "Ouvrir le Studio", "Lancer le Studio Vectoriel") sur cette page d'accueil ? → A: Il s'agit uniquement d'une maquette d'intégration d'abord. Les boutons d'action restent des ancres visuelles de démonstration sans configuration de routage complexe vers un studio externe pour l'instant.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Découverte de l'Accueil et Navigation Principale (Priority: P1)

En tant que visiteur découvrant la plateforme QRCraft (notamment un professionnel de l'hôtellerie ou restauration), je souhaite accéder immédiatement dès la racine du site (`/`) à une page d'accueil valorisante et fidèle à la maquette graphique, afin de comprendre immédiatement la proposition de valeur et accéder facilement aux fonctionnalités clés.

**Why this priority**: C'est le point d'entrée principal de l'application et la première impression utilisateur. Sans cette vitrine d'accueil complète et fidèle, l'acquisition et la conversion sont impossibles.

**Independent Test**: Charger l'URL racine (`http://localhost:4200/`) : la page d'accueil complète s'affiche avec son en-tête, sa section héroïque, son simulateur, sa grille d'avantages, sa galerie d'inspirations, sa bannière d'appel à l'action et son pied de page.

**Acceptance Scenarios**:

1. **Given** un utilisateur accédant à l'URL racine (`/`), **When** la page se charge, **Then** l'en-tête de navigation présente le logo QRCraft, les liens de navigation (Accueil, Studio de Création, Modèles & Galerie, Tarifs) et le bouton d'action "Ouvrir le Studio".
2. **Given** un utilisateur consultant la section Hero, **When** il parcourt le contenu, **Then** il observe l'accroche "Donnez vie à vos QR Codes avec style & couleur", les badges de réassurance (Vectoriel SVG & HD, Scan garanti 30%, Sans inscription) et la prévisualisation visuelle haute fidélité du QR Code Bistro Premium avec pastilles d'état.
3. **Given** un utilisateur sur écran mobile ou tablette, **When** il redimensionne la fenêtre ou consulte la page, **Then** la mise en page s'adapte de façon fluide sans débordement horizontal ni rupture visuelle.

---

### User Story 2 - Simulateur Express Interactif en Direct (Priority: P2)

En tant qu'utilisateur potentiel, je souhaite tester directement sur la page d'accueil un aperçu instantané de mon futur QR code en saisissant une URL/texte, en sélectionnant une palette de couleur et en personnalisant le bandeau de texte, afin d'expérimenter la valeur du produit sans barrière à l'entrée.

**Why this priority**: Permet l'engagement immédiat et prouve la simplicité de l'outil avant même d'entrer dans le studio avancé.

**Independent Test**: Saisir un texte dans le champ d'encodage du simulateur express et cliquer sur une palette : la carte d'aperçu dynamique met à jour visuellement le rendu du QR code et son libellé en temps réel.

**Acceptance Scenarios**:

1. **Given** le simulateur express affiché sur la page d'accueil, **When** l'utilisateur saisit une adresse ou un texte dans le champ d'encodage, **Then** l'aperçu du QR code se recalcule et affiche les données encodées.
2. **Given** les 4 harmonies chromatiques proposées (Violet Pop, Menthe Fraîche, Sunset Coral, Cyan Électrique), **When** l'utilisateur clique sur une palette différente, **Then** les teintes de la carte et du QR code s'ajustent instantanément avec un retour visuel sur l'option active.
3. **Given** le champ de texte du bandeau inférieur, **When** l'utilisateur modifie le libellé, **Then** le texte sous le QR code dans la carte de prévisualisation reflète fidèlement la saisie.
4. **Given** une configuration réalisée dans le simulateur, **When** l'utilisateur clique sur "Ouvrir cette configuration dans le Studio", **Then** le bouton réagit de manière fluide sans erreur applicative.

---

### User Story 3 - Exploration des Atouts & Cas d'Usage Réels (Priority: P3)

En tant que professionnel de l'hôtellerie-restauration, je souhaite parcourir les arguments techniques/esthétiques et les exemples de mise en situation concrète (Chevalet Wi-Fi Café, Stickers Instagram, Carte de Visite Digitale, Porte-Menu de Table), afin de m'inspirer et d'identifier le cas d'usage adapté à mon établissement.

**Why this priority**: Renforce la crédibilité de marque auprès d'une cible exigeante (hôtellerie de luxe) et déclenche l'acte de création.

**Independent Test**: Faire défiler la page jusqu'aux sections "Ingénierie & Esthétique" et "Conçus pour le monde réel" : les 4 cartes d'atouts et les 4 cas concrets s'affichent avec leurs visuels respectifs, libellés de format et actions associées.

**Acceptance Scenarios**:

1. **Given** la section d'arguments techniques ("Pourquoi vos QR Codes méritent mieux qu'un simple carré noir"), **When** l'utilisateur lit les blocs, **Then** les 4 piliers (Personnalisation totale, Intégration de logo, Bandeaux & Cadres, Tous types de contenus) sont distinctement lisibles avec leurs icônes et micro-indicateurs.
2. **Given** la galerie de cas d'usage réels, **When** l'utilisateur consulte une carte (ex: Chevalet Wi-Fi Café), **Then** il visualise la photo de mise en scène, le badge de catégorie (Hospitality, Réseaux Sociaux, Business vCard, Restauration), le format d'impression recommandé et le lien d'action "Utiliser ce modèle".
3. **Given** la bannière finale d'appel à l'action, **When** l'utilisateur arrive en bas de page, **Then** il dispose d'un point d'accès direct vers le studio de création ("Lancer le Studio Vectoriel") et vers la galerie complète.

---

### Edge Cases

- **Entrée vide ou chaîne très longue dans le simulateur** : Lorsque le champ d'encodage est vidé, le simulateur affiche une valeur par défaut esthétique sans briser la génération du QR code. Si la chaîne est très longue, elle est encodée avec ajustement automatique de la densité tout en maintenant les marges de sécurité.
- **Caractères spéciaux et émoticônes** : Le bandeau inférieur accepte les émoticônes (ex: "REJOIGNEZ LA COMMUNAUTÉ ✨") et les caractères accentués sans altération typographique.
- **Absence de réseau / Mode déconnecté** : L'affichage des composants structurels de la page d'accueil et le simulateur vectoriel fonctionnent sans dépendance à des appels serveurs externes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: L'application DOIT afficher la page d'accueil complète telle que définie par la maquette visuelle dès l'accès à la racine du site (`/`).
- **FR-002**: L'en-tête de navigation DOIT être fixé en haut de l'écran avec un flou d'arrière-plan (effet glassmorphism), inclure l'identité QRCraft, les liens de navigation, le bouton d'ouverture du studio et l'accès profil.
- **FR-003**: La section Héroïque DOIT présenter le titre contrasté avec dégradé textuel, le sous-titre explicatif, les boutons d'appel à l'action principaux, les 3 badges de réassurance et le rendu visuel de mise en avant du QR Code Bistro Premium.
- **FR-004**: Le Simulateur Express DOIT être directement opérationnel sur la page d'accueil : il permet de modifier le texte/URL à encoder, de choisir parmi 4 palettes prédéfinies, et d'ajuster le libellé du bandeau inférieur avec répercussion visuelle instantanée sur la carte d'aperçu.
- **FR-005**: La section des Atouts DOIT présenter les 4 cartes illustrées avec icônes distinctes et micro-badges (ex: "+40 Nuances", "Auto-padding intelligent", "+47% de conversions").
- **FR-006**: La section Galerie & Inspirations DOIT exposer les 4 modèles d'application réelle (Hospitality, Réseaux sociaux, Business vCard, Restauration) avec leurs photographies de contexte, descriptions et déclencheurs d'action.
- **FR-007**: La bannière finale de conversion DOIT afficher le titre d'engagement, la promesse de valeur, les boutons d'action secondaires et les mentions de conformité aux standards.
- **FR-008**: Le pied de page DOIT structurer l'ensemble des liens institutionnels, légaux et de support sur 4 colonnes, avec un indicateur d'état des services.
- **FR-009**: Le design, les couleurs, les typographies (Plus Jakarta Sans), les arrondis et les espacements DOIVENT être strictement conformes au guide de style `DESIGN.md` et à la maquette `screen.png`.
- **FR-010**: Les boutons d'action vers le Studio (ex: "Ouvrir le Studio", "Créer mon premier QR Code gratuit", "Lancer le Studio Vectoriel") sont intégrés de manière visuelle et non-bloquante comme éléments de maquette d'intégration sans navigation externe requise pour cette phase.

### Key Entities *(include if feature involves data)*

- **Palette Preset**: Représente une harmonie chromatique sélectionnable dans le simulateur (identifiant, nom affiché, couleur primaire, couleur secondaire, dégradé de fond).
- **Showcase Model**: Représente un cas d'usage inspirant dans la galerie (titre, catégorie, description, format d'impression/support, image d'illustration, configuration visuelle du QR code).
- **Simulator State**: Représente l'état transitoire de personnalisation en mémoire vive (URL/texte à encoder, palette active, texte du bandeau, visibilité du logo).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: La page d'accueil s'affiche de manière fluide et complète en moins de 1,5 seconde lors du chargement initial sur connexion standard.
- **SC-002**: Conformité visuelle "pixel-perfect" : alignement, hiérarchie typographique, contrastes et rayons de courbure correspondent à 100% à la maquette de référence (`screen.png`).
- **SC-003**: Réactivité instantanée du simulateur : toute modification de texte ou clic sur une palette chromatique met à jour l'aperçu en moins de 50 millisecondes (ressenti temps réel sans latence perceptible).
- **SC-004**: 100% du parcours de découverte et d'essai sur la page d'accueil s'effectue sans aucune demande d'authentification ni écran bloquant.
- **SC-005**: La page s'adapte sans rupture sur les formats d'écrans usuels : Mobile (375px+), Tablette (768px+) et Bureau (1024px, 1440px+).

## Assumptions

- Les polices Google Fonts (Plus Jakarta Sans) et les icônes Material Symbols Outlined sont chargées au niveau global de l'application pour restituer exactement la typographie de la maquette.
- Les images de mise en situation pour les cas d'usage réels utilisent les URLs haute définition de la maquette ou des assets locaux équivalents.
- Les boutons d'action servent de démonstration visuelle d'intégration fidèle à la maquette sans routage de studio complexe à ce stade.
