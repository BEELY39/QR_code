# Contrats d'Interface Composants : 005-ui-and-frame-refinement

## 1. Dumb Components : Formulaires de Personnalisation

### `FrameFormComponent`
- **Inputs** :
  - `initialConfig = input<QrFrameOptions | null>(null)` : Configuration initiale du cadre
- **Outputs** :
  - `configChange = output<QrFrameOptions>()` : Émis lors du changement de style, de texte, de police ou de couleur

### `StylingFormComponent`
- **Inputs** :
  - `initialStyle = input<DotStyleType>('rounded')` : Forme initiale des points
- **Outputs** :
  - `styleChange = output<DotStyleType>()` : Émis lors du clic sur une carte de forme

### `ColorsFormComponent`
- **Inputs** :
  - `initialConfig = input.required<QrDesignOptions>()` : Configuration chromatique initiale
- **Outputs** :
  - `configChange = output<Partial<QrDesignOptions>>()` : Émis lors du changement de couleur, dégradé ou fond

### `LogoFormComponent`
- **Inputs** :
  - `initialLogo = input<string | null>(null)` : Base64 du logo initial
- **Outputs** :
  - `logoChange = output<string | null>()` : Émis lors du chargement ou de la suppression du logo

---

## 2. Smart / Dumb Contract : `SimulatorSectionComponent`

- **Inputs** :
  - `design = input.required<QrDesignOptions>()`
  - `mode = input<InputMode>('url')`
  - `wifiConfig = input<WifiConfig | null>(null)`
  - `palettes = input.required<readonly ColorPalette[]>()`
  - `selectedPalette = input.required<ColorPalette>()`
  - `qrSvgMarkup = input<string>('')`
  - `isGenerating = input<boolean>(false)`
- **Outputs** :
  - `designChange = output<Partial<QrDesignOptions>>()`
  - `modeChange = output<InputMode>()`
  - `wifiConfigChange = output<WifiConfig>()`
  - `valueChange = output<string>()`
  - `paletteSelect = output<string>()`
  - `downloadClick = output<void>()`
