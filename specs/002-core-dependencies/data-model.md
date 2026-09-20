# Data Model: Types et Contrats des Dépendances Cœur (V1)

## 1. Modèle de Configuration QR Vectoriel (`QrEngineOptions`)

Représente les options typées pour l'instanciation et la mise à jour dynamique du moteur `qr-code-styling`.

```typescript
export type DotType = 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
export type CornerSquareType = 'dot' | 'square' | 'extra-rounded';
export type CornerDotType = 'dot' | 'square';
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface GradientOptions {
  type: 'linear' | 'radial';
  rotation?: number;
  colorStops: Array<{ offset: number; color: string }>;
}

export interface QrEngineOptions {
  width: number;
  height: number;
  data: string;
  margin?: number;
  image?: string; // Data URL Base64 du logo
  qrOptions: {
    typeNumber: number;
    mode?: 'Byte' | 'Numeric' | 'Alphanumeric' | 'Kanji';
    errorCorrectionLevel: ErrorCorrectionLevel; // Forcé à 'Q' ou 'H' si image présente
  };
  imageOptions?: {
    hideBackgroundDots?: boolean;
    imageSize?: number;
    margin?: number;
    crossOrigin?: string;
  };
  dotsOptions: {
    type: DotType;
    color?: string;
    gradient?: GradientOptions;
  };
  cornersSquareOptions: {
    type?: CornerSquareType;
    color?: string;
    gradient?: GradientOptions;
  };
  cornersDotOptions: {
    type?: CornerDotType;
    color?: string;
    gradient?: GradientOptions;
  };
  backgroundOptions?: {
    color?: string;
    gradient?: GradientOptions;
  };
}
```

---

## 2. Modèle d'Export Haute Résolution (`ExportOptions`)

Définit le contrat d'export pour la capture DOM (`html-to-image`) et la génération PDF (`jspdf`).

```typescript
export type ExportFormat = 'png' | 'svg' | 'pdf';
export type ExportScale = 1 | 2 | 3; // 1 = standard (96 DPI), 2 = Retina (@2x), 3 = Print Haute Définition (300 DPI)

export interface ExportOptions {
  format: ExportFormat;
  scale: ExportScale;
  filename: string;
  elementId?: string; // Sélecteur ou référence HTMLElement pour la capture Tailwind
  pdfPageSize?: 'a4' | 'a5' | 'a6' | 'custom';
  pdfOrientation?: 'portrait' | 'landscape';
}

export interface ExportResult {
  blob: Blob;
  dataUrl: string;
  filename: string;
  revocationCallback: () => void; // Conforme Principe III (Hygiène mémoire)
}
```

---

## 3. Modèle d'Authentification Différée (`AuthState`)

Gère l'état d'authentification sans chargement anticipé.

```typescript
export interface SocialUserProfile {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
  provider: 'google';
}

export interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: SocialUserProfile | null;
  error: string | null;
}
```
