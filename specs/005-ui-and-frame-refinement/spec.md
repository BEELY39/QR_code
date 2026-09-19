# Spécification Fonctionnelle : 005-ui-and-frame-refinement

**Branche de fonctionnalité** : `005-ui-and-frame-refinement`

**Création** : 2026-09-19

**Statut** : Prêt pour validation

**Origine** : Demande utilisateur : Refonte UI des formulaires de personnalisation du QR code selon la charte graphique (DA) du site et correction de l'effet « double cadre » dans la zone d'aperçu en direct.

---

## Scénarios Utilisateurs & Parcours *(obligatoire)*

### User Story 1 - Aperçu unifié du QR Code et suppression du double cadre (Priorité : P1) ⭐ MVP

En tant qu'utilisateur créant ou personnalisant un QR code,
je souhaite que le cadre sélectionné (ex: bandeau simple ou badge callout) s'applique directement et uniquement autour du QR code sans être imbriqué dans un autre faux cadre ou bandeau contradictoire,
afin d'obtenir un rendu visuel net, professionnel et fidèle aux maquettes de référence.

**Pourquoi cette priorité** : C'est le défaut visuel majeur remonté par l'utilisateur (effet de double cadre « cadre au-dessus d'un autre cadre » et double slogan en conflit visuel direct).

**Test indépendant** : Sélectionner différents styles de cadre ("Bandeau inférieur", "Badge avec flèche", ou "Aucun cadre") et vérifier dans l'aperçu que seul le cadre choisi entoure le QR code, sans superposition avec une boîte mockup externe redondante.

**Scénarios d'acceptation** :
1. **Étant donné** l'utilisateur dans le simulateur en direct, **Quand** il choisit le style "Bandeau inférieur" avec le texte `SCAN ME`, **Alors** l'aperçu affiche le QR code enveloppé d'une bordure unique avec le bandeau texte noir directement rattaché en bas, sans autre encadré superflu autour.
2. **Étant donné** l'utilisateur dans le simulateur, **Quand** il choisit le style "Badge flottant" avec le texte `SCAN ME`, **Alors** l'aperçu affiche le QR code bordé surmontant un badge arrondi avec un pointeur triangulaire pointant vers le code.
3. **Étant donné** l'utilisateur choisissant "Aucun cadre", **Alors** le QR code apparaît dans son format pur vectoriel sans bordure ni badge superflu.

---

### User Story 2 - Harmonisation graphique des formulaires selon la DA du site (Priorité : P1)

En tant qu'utilisateur,
je souhaite que tous les panneaux et formulaires de configuration (Wi-Fi, Couleurs, Cadre, Forme des points, Logo) adoptent le design system luxueux du site (typographie, arrondis, couleurs M3, segmented controls, sélecteurs visuels à cartes),
afin que l'expérience de personnalisation soit intuitive, élégante et esthétiquement valorisante.

**Pourquoi cette priorité** : L'apparence actuelle des formulaires internes manque de finition (champs bruts navigateur, listes déroulantes simples) et détonne avec le reste de la page d'accueil.

**Test indépendant** : Parcourir chacun des onglets et vérifier la présence des composants visuels alignés sur Tailwind / Material 3 (swatches chromatiques, cartes de sélection de forme/cadre avec coches, zone d'upload soignée).

**Scénarios d'acceptation** :
1. **Étant donné** l'onglet "Cadre" actif, **Quand** l'utilisateur consulte les options, **Alors** les styles de cadre sont présentés sous forme de cartes d'aperçu miniature cliquables avec indicateur de sélection au lieu d'un menu déroulant `<select>` standard.
2. **Étant donné** l'onglet "Forme des points" actif, **Quand** l'utilisateur sélectionne un style, **Alors** chaque variante présente une pastille visuelle explicite avec feedback interactif (hover, focus, état actif).
3. **Étant donné** l'onglet "Logo" actif, **Quand** l'utilisateur arrive sur le panneau, **Alors** une zone de dépôt drag-and-drop moderne avec icône vectorielle et état de survol est disponible, avec aperçu miniature et bouton de suppression discret.
4. **Étant donné** l'onglet "Couleurs" actif, **Quand** l'utilisateur configure les couleurs, **Alors** les bascules Uni / Dégradé utilisent un segmented control élégant, accompagné de swatches de couleurs rapides en plus des pipettes.

---

### User Story 3 - Simplification du flux de saisie et cohérence des textes (Priorité : P2)

En tant qu'utilisateur,
je souhaite que les champs de texte soient unifiés (le texte du cadre remplaçant ou se synchronisant avec le slogan inférieur du simulateur),
afin de ne pas avoir deux entrées concurrentes de texte ("Texte du bandeau inférieur" et "Texte du cadre") qui prêtent à confusion.

**Pourquoi cette priorité** : Simplifie l'interface cognitivement en éliminant les redondances dans les réglages.

**Test indépendant** : Modifier le texte d'accompagnement dans le panneau Cadre et vérifier qu'il met à jour immédiatement le texte visible sur le cadre du QR code.

**Scénarios d'acceptation** :
1. **Étant donné** un cadre avec texte activé, **Quand** l'utilisateur saisit un texte, **Alors** ce texte est directement reflété sur le bandeau ou badge du QR code en temps réel.
2. **Étant donné** l'absence de cadre ("Aucun"), **Alors** l'option de saisie de texte de cadre se masque proprement pour ne pas encombrer l'écran inutilement.

---

### Cas Limites & Gestion des Exceptions

- **Texte de cadre trop long** : Lorsque l'utilisateur saisit une phrase longue (ex: > 30 caractères), le texte doit s'ajuster ou se tronquer élégamment sans casser la largeur du conteneur du QR code.
- **Logo transparent ou non carré** : Les logos avec transparence (PNG / SVG) doivent être centrés avec un fond de réserve blanc ou transparent propre pour ne pas empiéter de façon illisible sur les motifs du code.
- **Contraste de couleur** : Si l'utilisateur choisit une couleur de cadre sombre, le texte par défaut doit basculer automatiquement en blanc pour assurer une lisibilité optimale.

---

## Exigences Fonctionnelles *(obligatoire)*

- **FR-001** : Le conteneur d'aperçu du QR code DOIT afficher le cadre sélectionné comme l'enveloppe directe du QR code, en éliminant tout conteneur extérieur redondant ou double texte de bandeau.
- **FR-002** : Le système DOIT supporter fidèlement les styles de cadre visualisés :
  - Style 1 : Bandeau inférieur rattaché (fond coloré avec texte contrasté intégré sous la matrice QR).
  - Style 2 : Badge flottant (pilule arrondie avec pointeur triangulaire dirigé vers le QR code).
  - Style 3 : Cadre fin arrondi sans texte.
  - Style 4 : Aucun cadre (matrice pure).
- **FR-003** : Tous les formulaires de configuration (Cadre, Formes, Couleurs, Logo, Wi-Fi) DOIVENT utiliser les tokens de design du projet (`bg-surface-container`, `text-on-surface`, `rounded-2xl`, `font-label-md`, etc.).
- **FR-004** : Les listes de choix (Styles de cadre, Formes de points) DOIVENT être modélisées sous forme de cartes d'options graphiques sélectionnables (avec icône, étiquette et état actif).
- **FR-005** : L'upload de logo DOIT offrir une zone de drag-and-drop soignée respectant le traitement en mémoire sans transit serveur (Zero-Serveur).
- **FR-006** : Le téléchargement du QR code DOIT exporter l'ensemble visuel incluant le cadre et son texte sous format SVG vectoriel haute fidélité.

---

## Critères de Succès *(mesurables et agnostiques de la technologie)*

- **SC-001** : 100% des cadres sélectionnés s'affichent sans aucun effet de double bordure ni conflit de texte dans l'aperçu.
- **SC-002** : Le design des 5 formulaires de personnalisation est 100% aligné avec la charte graphique Tailwind du projet.
- **SC-003** : L'utilisateur peut changer de cadre, de couleur ou de logo avec un retour visuel instantané (< 100 ms).
- **SC-004** : Zéro régression sur la suite de tests unitaires et d'intégration existante.

---

## Hypothèses & Dépendances

- L'export SVG du cadre et de son texte s'appuiera soit sur le rendu DOM vectoriel (`dom-export.service`), soit sur une construction SVG groupée `<g>` propre pour préserver la fidélité graphique lors du téléchargement.
- Les polices Google Fonts sélectionnées pour le texte du cadre continuent d'être chargées via le projet.
