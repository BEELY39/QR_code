# Data Model: Types & Contrats du Simulateur de QR Code Réel

Conformément à la **Règle n°5 de `GEMINI.md` : Typage Fort & Exhaustif « à la Rust »**, tous les modèles sont typés avec des unions discriminées, des propriétés `readonly`, et sans échappatoire `any`.

---

## 1. Mode d'Entrée & Contenu du QR Code (`QrPayload`)

```typescript
/** Mode de saisie sélectionnable dans le simulateur */
export type InputMode = 'url' | 'text';

/** Union discriminée modélisant la charge utile encodée dans le QR code */
export type QrPayload =
  | {
      readonly kind: 'url';
      readonly rawUrl: string;
      readonly targetUrl: string; // URL normalisée avec 'https://' si omis
    }
  | {
      readonly kind: 'text';
      readonly content: string; // Texte brut non modifié
    };
```

### Règles de Transition & de Normalisation
* En mode `url` : si l'utilisateur saisit `palace-paris.com`, `targetUrl` est calculé comme `https://palace-paris.com`.
* Si l'utilisateur saisit déjà `https://` ou `http://`, l'URL est préservée.
* En mode `text` : les sauts de ligne, caractères spéciaux et codes Wi-Fi sont préservés exactement tels que saisis.

---

## 2. État du Générateur (`GeneratorStatus`)

```typescript
/** Union discriminée modélisant le cycle de vie asynchrone du rendu */
export type GeneratorStatus =
  | { readonly kind: 'idle' }
  | { readonly kind: 'generating' }
  | { readonly kind: 'ready'; readonly svgMarkup: string }
  | { readonly kind: 'error'; readonly errorMessage: string };
```

* Aucun drapeau booléen incohérent (`isLoading = true` et `isError = true` simultanés sont impossibles).
* Tout affichage de statut dans les composants de présentation utilise un `switch (status.kind)` exhaustif avec contrôle de type `never`.

---

## 3. État Global du Simulateur en Direct (`LiveSimulatorState`)

```typescript
import { ColorPalette } from './palette.model';

export interface LiveSimulatorState {
  readonly mode: InputMode;
  readonly payload: QrPayload;
  readonly selectedPalette: ColorPalette;
  readonly bottomText: string;
  readonly status: GeneratorStatus;
}
```
