# Research Document: Générateur de QR Code Réel en Direct (Live Simulator)

## 1. Stylisation Haute Définition (Zéro Noir & Blanc)

- **Decision**: Configurer `qr-code-styling` avec `dotsOptions.type = 'rounded'`, `cornersSquareOptions.type = 'extra-rounded'`, et `cornersDotOptions.type = 'dot'`.
- **Rationale**: 
  - Répond à l'exigence esthétique fondamentale : proscrire le rendu brut noir et blanc à angles droits standard.
  - Les modules arrondis créent un rendu organique haut de gamme adapté aux palettes luxe.
  - Les grands yeux extérieurs adoptent un contour adouci (`extra-rounded`) tandis que l'œil intérieur est un cercle parfait (`dot`).
- **Alternatives considered**:
  - `dotsOptions.type = 'square'` : Rejeté car trop austère et générique.
  - `dotsOptions.type = 'classy'` : Intéressant mais moins lisible sur les petits écrans que `rounded`.

---

## 2. Dégradés Chromatiques Réactifs

- **Decision**: Mapper les couleurs de la palette active vers des dégradés linéaires à 45° pour les points et les coins du QR code.
- **Rationale**:
  - Les 4 palettes créées pour la page d'accueil (Violet Pop, Menthe Fraîche, Sunset Coral, Cyan Électrique) disposent de nuances `start`, `mid`, et `end`.
  - Le passage de ces dégradés dans `dotsOptions.gradient` et `cornersSquareOptions.gradient` donne un aspect vibrant et luxueux.
- **Alternatives considered**:
  - Couleurs unies plates : Rejeté car le rendu manque de relief par rapport à la maquette initiale.

---

## 3. Logo Circulaire Central In-Memory

- **Decision**: Déclarer un logo SVG vectoriel circulaire stylisé en constante Base64 in-memory dans `src/app/core/constants/qr-logo.constant.ts`.
- **Rationale**:
  - Garantit 0 requête réseau (Principe I).
  - Évite les délais de chargement d'image qui causeraient un flash visuel.
  - Reste 100% net quelle que soit la résolution de l'écran.
  - Configuration `imageOptions: { hideBackgroundDots: true, imageSize: 0.28, margin: 4 }` pour créer une bordure de respiration propre.
- **Alternatives considered**:
  - Image PNG dans `assets/` : Risque de flou sur les écrans haute densité Retina et dépendance au système de fichiers statiques.

---

## 4. Modélisation Rust-like du Contenu (Lien vs Texte)

- **Decision**: Modéliser le commutateur avec une union discriminée `QrPayload` :
  ```typescript
  export type InputMode = 'url' | 'text';
  export type QrPayload =
    | { readonly kind: 'url'; readonly rawUrl: string; readonly targetUrl: string }
    | { readonly kind: 'text'; readonly content: string };
  ```
- **Rationale**:
  - Élimine tout état invalide (*Make Illegal States Unrepresentable*).
  - Le compilateur TypeScript garantit que si `kind === 'url'`, `targetUrl` est disponible et normalisé avec `https://`.
  - Si `kind === 'text'`, le texte brut est préservé tel quel sans altération de protocole.
- **Alternatives considered**:
  - Un seul champ string avec un booléen `isText` : Dangereux, propice aux désynchronisations et régressions.

---

## 5. Debounce Réactif (150 ms)

- **Decision**: Utiliser un debounce de 150 ms sur la mise à jour du payload avant de solliciter le recalcul du QR code.
- **Rationale**:
  - Évite les re-calculs intempestifs à chaque touche lors d'une frappe rapide.
  - Garantit une latence imperceptible pour l'utilisateur tout en préservant le thread UI.
