# Recherche & Décisions Techniques : 005-ui-and-frame-refinement

## 1. Architecture des Cadres & Suppression du Double Cadre

### Contexte
Dans la version précédente, le conteneur d'aperçu du simulateur comportait une fausse carte sombre statique (`bg-inverse-surface`) avec un slogan prédéfini (*"REJOIGNEZ LA COMMUNAUTÉ ✨"*) et une URL factice (*"instagram.com/monbistro"*). L'application d'un cadre venait encapsuler le SVG à l'intérieur de cette carte, produisant un « cadre dans un cadre » disgracieux avec deux textes en concurrence directe.

### Décisions Validées
1. **Conteneur d'aperçu unifié (Single-Container Canvas)** :
   - La zone d'aperçu droite devient un canvas neutre de présentation de studio (`bg-surface-container-low`).
   - Le QR code et son cadre constituent l'unique élément visuel central.
   - L'ancien bandeau sombre redondant est supprimé lorsque le simulateur affiche le QR code.
2. **Implémentation des Styles de Cadre de Référence (conforme aux images utilisateur)** :
   - **`simple-bottom` (Image 2)** :
     - Cadre extérieur blanc/coloré avec bordures arrondies douces (`rounded-2xl`).
     - Zone QR code blanche au centre.
     - Bandeau plein rattaché en bas portant le texte (ex: `SCAN ME`) centré en majuscules avec la typographie choisie.
   - **`badge-bottom` (Image 3)** :
     - Cadre entourant le QR code avec bordure contrastée (`border-4 border-on-surface rounded-2xl`).
     - Badge pilule détaché sous le QR code avec un petit pointeur triangulaire (callout arrow) en CSS/SVG orienté vers le bas du code QR.
   - **`rounded-border`** :
     - Cadre minimaliste arrondi sans bandeau texte inférieur.
   - **`none`** :
     - Matrice QR pure sans bordure additionnelle.
3. **Unification du Texte d'Accompagnement** :
   - Le champ "Texte du bandeau" du simulateur et le "Texte du cadre" sont fusionnés en une seule source de vérité réactive : `design.frame.text`.

---

## 2. Refonte Visuelle des Formulaires (Alignement Charte Graphique M3 / Tailwind)

### Contexte
Les formulaires de configuration présentaient des éléments HTML natifs sans habillage moderne (champs `<select>`, boutons de radio bruts, sélecteurs de couleur standard).

### Décisions Validées
1. **Composants de Sélection Graphique (Visual Cards)** :
   - Remplacement des listes déroulantes de cadres (`frame-form`) et de formes (`styling-form`) par des grilles de cartes cliquables intégrant une miniature du style, un intitulé clair et un anneau de sélection violet `ring-2 ring-primary bg-primary/5`.
2. **Sélecteur de Couleurs et Dégradés (`colors-form`)** :
   - Remplacement des boutons radio natifs par un *segmented control* moderne (Uni / Dégradé).
   - Présentation de swatches de couleurs de marque rapides (Noir luxe, Violet néon, Or impérial, Emeraude, etc.) pour une sélection instantanée en 1 clic.
   - Pipette de couleur stylisée avec affichage du code HEX.
3. **Upload de Logo (`logo-form`)** :
   - Zone de glisser-déposer au design aéré avec icône vectorielle `upload_file`, état de survol animé et prévisualisation miniature avec bouton de suppression discret.
4. **Formulaire Wi-Fi (`wifi-form`)** :
   - Sélecteur de chiffrement en *segmented buttons* (`WPA`, `WEP`, `Aucun`).
   - Champs de saisie aux normes du projet (`bg-surface-container-lowest`, `rounded-2xl`, icônes intégrées, bascule visuelle du mot de passe avec icône œil).

---

## 3. Stratégie d'Export Vectoriel & Rendu DOM Haute Définition

### Contexte
Lors du clic sur « Télécharger », le QR code cadré doit être exporté avec son cadre et son texte exacts.

### Décisions Validées
- Si le style de cadre est `none` : utilisation directe de `qr-engine.service.download()` (export natif direct ultra-rapide).
- Si un cadre est actif (`simple-bottom`, `badge-bottom`, `rounded-border`) : utilisation de `dom-export.service.downloadAsImage()` pour capturer l'ensemble du conteneur cadré `#live-qr-framed-container` en PNG/SVG haute définition (ratio x2 ou x3 pour une netteté d'impression optimale).
- Respect absolu du Principe III (Hygiène Mémoire) : révocation immédiate des URLs de téléchargement et garbage collection.
