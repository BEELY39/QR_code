import { ColorPalette } from './palette.model';

/** Mode de saisie sélectionnable dans le simulateur */
export type InputMode = 'url' | 'text' | 'wifi';

/** Type de chiffrement Wi-Fi supporté */
export type WifiEncryption = 'WPA' | 'WEP' | 'nopass';

/** Configuration de connexion Wi-Fi */
export interface WifiConfig {
  readonly ssid: string;
  readonly encryption: WifiEncryption;
  readonly password?: string;
  readonly hidden: boolean;
}

/** Union discriminée modélisant la charge utile encodée dans le QR code */
export type QrPayload =
  | {
      readonly kind: 'url';
      readonly rawUrl: string;
      readonly targetUrl: string;
    }
  | {
      readonly kind: 'text';
      readonly content: string;
    }
  | {
      readonly kind: 'wifi';
      readonly config: WifiConfig;
      readonly rawString: string;
    };

/** Types de dégradé de couleur */
export type GradientType = 'linear' | 'radial';

/** Définition d'un dégradé vectoriel */
export interface QrGradientColor {
  readonly type: GradientType;
  readonly rotation?: number;
  readonly colorStops: readonly { readonly offset: number; readonly color: string }[];
}

/** Union discriminée pour la configuration d'une couleur (unicolore ou dégradé) */
export type QrColorConfig =
  | { readonly kind: 'single'; readonly color: string }
  | { readonly kind: 'gradient'; readonly gradient: QrGradientColor };

/** Styles de points (dots) pour le QR code */
export type DotStyleType = 'dots' | 'rounded' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';

/** Styles de cadre extérieur */
export type FrameStyleType = 'none' | 'simple-bottom' | 'rounded-bottom' | 'badge-bottom';

/** Options de personnalisation du cadre */
export interface QrFrameOptions {
  readonly style: FrameStyleType;
  readonly text: string;
  readonly font: string;
  readonly frameColor: string;
  readonly textColor: string;
}

/** Configuration esthétique globale du QR code */
export interface QrDesignOptions {
  readonly dotsStyle: DotStyleType;
  readonly dotsColor: QrColorConfig;
  readonly cornersColor: string;
  readonly backgroundColor: string;
  readonly customLogoBase64: string | null;
  readonly frame: QrFrameOptions;
}

/** Union discriminée modélisant le cycle de vie asynchrone du rendu */
export type GeneratorStatus =
  | { readonly kind: 'idle' }
  | { readonly kind: 'generating' }
  | { readonly kind: 'ready'; readonly svgMarkup: string }
  | { readonly kind: 'error'; readonly errorMessage: string };

/** État global complet du simulateur en direct */
export interface LiveSimulatorState {
  readonly mode: InputMode;
  readonly payload: QrPayload;
  readonly selectedPalette: ColorPalette;
  readonly design: QrDesignOptions;
  readonly bottomText: string;
  readonly status: GeneratorStatus;
}

