import { ColorPalette } from './palette.model';

/** Mode de saisie sélectionnable dans le simulateur */
export type InputMode = 'url' | 'text';

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
    };

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
  readonly bottomText: string;
  readonly status: GeneratorStatus;
}
