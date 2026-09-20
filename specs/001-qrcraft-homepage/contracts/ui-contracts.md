# UI Contracts: Composants Page d'Accueil QRCraft

## Contrats des Composants (Règle Service / Smart / Dumb)

### 1. `HomeComponent` (Smart Component)
- **Rôle** : Conteneur principal accessible via la route `/`.
- **Services injectés** : `QrSimulatorService`
- **Responsabilités** :
  - Fournit les états réactifs (Signals) du simulateur aux composants de présentation.
  - Intercepte les événements émis par `SimulatorSectionComponent` pour appeler le service.
  - Structure l'affichage séquentiel : Navbar, Hero, Simulateur, Atouts, Galerie, Bannière CTA, Footer.

---

### 2. `NavbarComponent` (Dumb Component)
- **Inputs** : Aucun
- **Outputs** :
  - `openStudio`: `EventEmitter<void>` (clic sur le CTA "Ouvrir le Studio")

---

### 3. `HeroSectionComponent` (Dumb Component)
- **Inputs** : Aucun
- **Outputs** :
  - `createFree`: `EventEmitter<void>` (clic sur "Créer mon premier QR Code gratuit")
  - `viewExamples`: `EventEmitter<void>` (clic sur "Voir les exemples")

---

### 4. `SimulatorSectionComponent` (Dumb Component)
- **Inputs** :
  - `urlInput`: `string` (valeur courante de l'URL/texte)
  - `palettes`: `ColorPalette[]` (liste des 4 palettes disponibles)
  - `activePaletteId`: `string` (identifiant de la palette active)
  - `bottomText`: `string` (libellé du bandeau inférieur)
  - `displayUrl`: `string` (URL nettoyée pour la prévisualisation)
- **Outputs** :
  - `urlChange`: `EventEmitter<string>` (saisie dans le champ d'encodage)
  - `paletteSelect`: `EventEmitter<string>` (clic sur une pastille de couleur)
  - `bottomTextChange`: `EventEmitter<string>` (saisie du bandeau inférieur)
  - `openStudioWithConfig`: `EventEmitter<void>` (clic sur "Ouvrir cette configuration dans le Studio")

---

### 5. `FeaturesSectionComponent` (Dumb Component)
- **Inputs** :
  - `features`: `FeatureCard[]` (liste des 4 cartes d'atouts)
- **Outputs** : Aucun

---

### 6. `ShowcaseSectionComponent` (Dumb Component)
- **Inputs** :
  - `models`: `ShowcaseModel[]` (liste des 4 cas réels)
- **Outputs** :
  - `selectModel`: `EventEmitter<string>` (clic sur "Utiliser ce modèle")

---

### 7. `CtaBannerComponent` (Dumb Component)
- **Inputs** : Aucun
- **Outputs** :
  - `launchStudio`: `EventEmitter<void>`
  - `browseGallery`: `EventEmitter<void>`

---

### 8. `FooterComponent` (Dumb Component)
- **Inputs** : Aucun
- **Outputs** : Aucun
