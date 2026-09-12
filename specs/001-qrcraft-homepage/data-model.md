# Data Model: Page d'Accueil QRCraft

## Vue d'ensemble

Le modèle de données de la page d'accueil reflète les entités en mémoire (In-Memory) manipulées par le simulateur express et les gabarits de présentation de la galerie.

---

## Entités

### 1. `ColorPalette` (Harmonie chromatique)

Représente une palette de couleurs prédéfinie sélectionnable dans le simulateur.

```typescript
export interface ColorPalette {
  id: string;                      // Ex: 'violet-pop', 'menthe-fraiche', 'sunset-coral', 'cyan-electrique'
  name: string;                    // Libellé affiché (ex: 'Violet Pop')
  gradient: string;                // Classe Tailwind ou valeur CSS de dégradé pour la pastille
  dotColor: string;                // Hexadécimal des points du QR Code (ex: '#412ce7')
  cornerColor: string;             // Hexadécimal des coins/yeux (ex: '#7a3cf5')
  badgeBg: string;                 // Couleur de fond du bandeau inférieur
  badgeText: string;               // Couleur du texte du bandeau
}
```

### 2. `SimulatorState` (État réactif du simulateur)

Représente l'état instantané du simulateur piloté par les signaux Angular dans `QrSimulatorService`.

```typescript
export interface SimulatorState {
  rawUrl: string;                  // URL ou chaîne encodée (par défaut: 'https://instagram.com/monbistro')
  selectedPaletteId: string;       // Identifiant de la palette active
  bottomText: string;              // Libellé du bandeau inférieur (par défaut: 'REJOIGNEZ LA COMMUNAUTÉ ✨')
  displayUrl: string;              // URL affichée en bas de carte (par défaut: 'instagram.com/monbistro')
}
```

### 3. `FeatureCard` (Atout produit)

Représente l'un des 4 piliers d'ingénierie et d'esthétique affichés dans la section d'arguments.

```typescript
export interface FeatureCard {
  icon: string;                    // Nom de l'icône Material Symbol (ex: 'palette', 'auto_fix_high', 'aspect_ratio', 'dashboard_customize')
  title: string;                   // Titre de l'atout (ex: 'Personnalisation totale')
  description: string;             // Description valorisante
  badgeText?: string;              // Micro-badge (ex: '+40 Nuances', 'Auto-padding intelligent')
  badgeIcon?: string;              // Icône optionnelle du micro-badge
}
```

### 4. `ShowcaseModel` (Cas d'usage réel / Galerie)

Représente un exemple concret d'application pour l'hôtellerie et la restauration.

```typescript
export interface ShowcaseModel {
  id: string;                      // Ex: 'chevalet-wifi', 'vitrine-instagram', 'vcard-digitale', 'porte-menu'
  category: string;                // Ex: 'HOSPITALITY', 'RÉSEAUX SOCIAUX', 'BUSINESS VCARD', 'RESTAURATION'
  title: string;                   // Ex: 'Chevalet Wi-Fi Café'
  description: string;             // Description du cas
  formatLabel: string;             // Ex: 'Format : Impression A6'
  actionLabel: string;             // Ex: 'Utiliser ce modèle'
  imageUrl: string;                // URL de l'image de mise en situation
  qrConfig: {
    bgGradient: string;            // Dégradé de la carte QR associée
    tagText: string;               // Libellé de sous-titre
    titleText: string;             // Libellé principal du QR
  };
}
```
