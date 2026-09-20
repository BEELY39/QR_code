# Research Document: Dépendances Cœur & Architecture d'Encapsulation (V1)

## 1. Moteur Vectoriel de QR Code : `qr-code-styling`

- **Decision**: Adopter `qr-code-styling` comme moteur de rendu QR code principal.
- **Rationale**: 
  - Produit nativement du pur SVG vectoriel (garantie de netteté optique absolue à toute échelle).
  - Supporte nativement les motifs géométriques demandés par le segment de luxe : dots arrondis, dots class, corners carrés ou adoucis, dégradés linéaires/radiaux.
  - Permet l'incrustation directe de logo au centre avec configuration automatique de la marge intérieure (`imageOptions: { margin, imageSize }`).
  - Gère nativement les niveaux de correction d'erreur `Q` (25%) et `H` (30%).
- **Alternatives considered**:
  - `qrcode` / `angularx-qrcode` : Rendu canvas/SVG basique sans support élégant des motifs de coins et gradients avancés.
  - Génération manuelle SVG : Trop complexe, risque de non-conformité avec les normes ISO/IEC 18004.
- **SSR Mitigation**: `qr-code-styling` manipule l'objet DOM ou SVG. Il sera chargé via un import dynamique `await import('qr-code-styling')` uniquement lorsque `isPlatformBrowser(this.platformId)` est vrai.

---

## 2. Moteur de Capture DOM : `html-to-image`

- **Decision**: Utiliser `html-to-image` pour la capture et l'exportation des gabarits hôteliers Tailwind CSS (chevalets de table, menus, stickers).
- **Rationale**:
  - Moteur moderne, plus rapide et plus fidèle que `html2canvas` pour reproduire les polices web Google Fonts, les dégradés CSS modernes et les règles Tailwind CSS v4.
  - Supporte l'option `pixelRatio: 2` ou `pixelRatio: 3` permettant de générer des exports en résolution 300 DPI pour les imprimeurs.
  - Produit directement des Data URL ou des Blobs manipulables en mémoire.
- **Alternatives considered**:
  - `html2canvas` : Problèmes connus avec les ombres portées complexes, les filtres CSS `backdrop-blur` (glassmorphism) et les syntaxes CSS modernes de Tailwind v4.
  - `dom-to-image` : Projet obsolète et non maintenu, incompatible avec les polices web modernes.
- **SSR Mitigation**: Exécuté exclusivement dans le contexte du navigateur lors d'une action utilisateur explicite ("Exporter en PNG").

---

## 3. Moteur d'Export PDF Print-Ready : `jspdf`

- **Decision**: Utiliser `jspdf` pour la composition et le téléchargement de documents PDF haute fidélité.
- **Rationale**:
  - Standard de facto dans l'écosystème web pour la génération PDF côté client (in-memory).
  - Permet d'insérer des images haute résolution (issues de `html-to-image`) ou des tracés vectoriels avec les dimensions physiques exactes (formats A4, A5, A6 pour chevalets de table).
  - Aucun transit de document vers un serveur : respect absolu de la confidentialité (Constitution Principe I).
- **Alternatives considered**:
  - `pdfmake` : Trop verbeux pour l'insertion de captures visuelles composées avec Tailwind CSS.
  - Impression native via `window.print()` : Manque de contrôle sur les marges, résolutions et formats d'impression professionnels.
- **SSR Mitigation**: Import dynamique et exécution conditionnée au navigateur.

---

## 4. Authentification Sociale Différée : `@abacritt/angularx-social-login`

- **Decision**: Installer `@abacritt/angularx-social-login` et créer un wrapper de service avec initialisation lazy.
- **Rationale**:
  - Fournit les bindings Angular pour Google Identity Services (GIS).
  - Peut être configuré avec un provider mock ou un token d'initialisation différé qui n'injecte aucun script distant Google tant que l'utilisateur ne clique pas sur une action de sauvegarde explicite.
  - Respecte le Principe Constitutionnel V (zéro pop-up, zéro friction au démarrage).
- **Alternatives considered**:
  - Intégration manuelle du script `https://accounts.google.com/gsi/client` : Fragile, non typé dans Angular, difficile à tester unitairement.
  - Firebase Auth : Trop lourd, requiert une configuration cloud complète et un stockage backend incompatible avec la V1 in-memory.
