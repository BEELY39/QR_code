# Data Model & Interfaces

## 1. QR Payload Discriminated Union

Extending the existing `QrPayload` to support Wi-Fi.

```typescript
// frontend/src/app/core/models/live-qr.model.ts

export type QrPayload = 
  | { readonly kind: 'url'; readonly data: string }
  | { readonly kind: 'text'; readonly data: string }
  | { readonly kind: 'wifi'; readonly config: WifiConfig };

export interface WifiConfig {
  readonly ssid: string;
  readonly encryption: 'WEP' | 'WPA' | 'nopass';
  readonly password?: string;
  readonly hidden: boolean;
}
```

## 2. Styling Options Models

Strictly typed models for the new visual configuration features.

```typescript
export interface QrColorOptions {
  readonly type: 'solid' | 'linear-gradient' | 'radial-gradient';
  readonly color: string; // Used for solid
  readonly gradientStops?: readonly { offset: number; color: string }[];
  readonly rotation?: number; // For linear gradients
}

export interface QrFrameOptions {
  readonly enabled: boolean;
  readonly style: 'rounded' | 'square' | 'none';
  readonly text: string;
  readonly font: string;
  readonly backgroundColor: string;
  readonly textColor: string;
}

export interface QrDesignOptions {
  readonly dotsStyle: 'square' | 'dots' | 'rounded' | 'classy' | 'extra-rounded';
  readonly dotsColor: QrColorOptions;
  readonly backgroundColor: QrColorOptions;
  readonly logoBase64: string | null;
  readonly frame: QrFrameOptions;
}
```

## 3. Simulator State

The main state managed by `QrSimulatorService`.

```typescript
export interface QrSimulatorState {
  readonly payload: QrPayload;
  readonly design: QrDesignOptions;
  readonly isGenerating: boolean;
  readonly error: string | null;
}
```

## 4. Helper: Wi-Fi Formatter

A pure function (Category 2, fully testable) to convert `WifiConfig` to the standard string.

```typescript
export function formatWifiPayload(config: WifiConfig): string {
  const enc = config.encryption;
  const ssid = escapeWifiString(config.ssid);
  const pass = config.password ? escapeWifiString(config.password) : '';
  const hidden = config.hidden ? 'true' : 'false';
  
  return `WIFI:T:${enc};S:${ssid};P:${pass};H:${hidden};;`;
}

function escapeWifiString(str: string): string {
  return str.replace(/([\\;:])/g, '\\$1');
}
```
