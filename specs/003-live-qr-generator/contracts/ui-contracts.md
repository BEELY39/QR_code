# UI Contracts: Simulateur de QR Code Réel

## 1. Contrat du Composant de Présentation `SimulatorSectionComponent`

Le Dumb Component `SimulatorSectionComponent` respecte la Règle n°2 (100% visuel, zéro service injecté, typage explicite sans `any`).

```typescript
import { input, output } from '@angular/core';
import { ColorPalette } from '../../../../core/models/palette.model';
import { InputMode } from '../../../../core/models/live-qr.model';

export interface ISimulatorSectionComponent {
  // Inputs typés explicitement
  readonly mode: InputSignal<InputMode>;
  readonly rawValue: InputSignal<string>;
  readonly palettes: InputSignal<readonly ColorPalette[]>;
  readonly selectedPalette: InputSignal<ColorPalette>;
  readonly bottomText: InputSignal<string>;
  readonly qrSvgMarkup: InputSignal<string>;
  readonly isGenerating: InputSignal<boolean>;

  // Outputs typés explicitement
  readonly modeChange: OutputEmitterRef<InputMode>;
  readonly valueChange: OutputEmitterRef<string>;
  readonly paletteSelect: OutputEmitterRef<string>;
  readonly bottomTextChange: OutputEmitterRef<string>;
  readonly downloadClick: OutputEmitterRef<void>;
}
```

---

## 2. Contrat du Service Réactif `QrSimulatorService`

Le service métier porte l'état et orchestre le moteur vectoriel `QrEngineService`.

```typescript
export interface IQrSimulatorService {
  readonly mode: Signal<InputMode>;
  readonly rawValue: Signal<string>;
  readonly payload: Signal<QrPayload>;
  readonly qrSvgMarkup: Signal<string>;
  readonly isGenerating: Signal<boolean>;
  readonly selectedPalette: Signal<ColorPalette>;
  readonly bottomText: Signal<string>;

  setMode(newMode: InputMode): void;
  setValue(newValue: string): void;
  selectPalette(paletteId: string): void;
  setBottomText(newText: string): void;
  downloadSvg(): Promise<void>;
}
```
