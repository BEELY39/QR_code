import { Injectable, computed, inject, signal } from '@angular/core';
import { ColorPalette } from '../../../core/models/palette.model';
import { GeneratorStatus, InputMode, QrPayload } from '../../../core/models/live-qr.model';
import { QrEngineService } from '../../../core/services/qr-engine.service';
import { QR_CENTRAL_LOGO_BASE64 } from '../../../core/constants/qr-logo.constant';
import { QrEngineOptions } from '../../../core/models/qr-engine.model';

@Injectable({
  providedIn: 'root',
})
export class QrSimulatorService {
  private readonly qrEngine = inject(QrEngineService);

  private readonly defaultPalettes: readonly ColorPalette[] = [
    {
      id: 'violet-pop',
      name: 'Violet Pop',
      gradientClass: 'from-primary via-primary-container to-secondary-container',
      dotColor: '#412ce7',
      cornerColor: '#7a3cf5',
      badgeBg: '#5b4dff',
      badgeText: '#ffffff',
      previewGradient: {
        start: '#412ce7',
        mid: '#7a3cf5',
        end: '#fe5b5b',
      },
    },
    {
      id: 'menthe-fraiche',
      name: 'Menthe Fraîche',
      gradientClass: 'from-tertiary via-tertiary-container to-tertiary-fixed',
      dotColor: '#005e56',
      cornerColor: '#00796f',
      badgeBg: '#00796f',
      badgeText: '#ffffff',
      previewGradient: {
        start: '#005e56',
        mid: '#00796f',
        end: '#63f9e8',
      },
    },
    {
      id: 'sunset-coral',
      name: 'Sunset Coral',
      gradientClass: 'from-secondary via-secondary-container to-secondary-fixed',
      dotColor: '#b4252d',
      cornerColor: '#fe5b5b',
      badgeBg: '#fe5b5b',
      badgeText: '#ffffff',
      previewGradient: {
        start: '#b4252d',
        mid: '#fe5b5b',
        end: '#ffb3af',
      },
    },
    {
      id: 'cyan-electrique',
      name: 'Cyan Électrique',
      gradientClass: 'from-on-primary-fixed-variant via-tertiary-container to-tertiary-fixed',
      dotColor: '#00201d',
      cornerColor: '#3edccc',
      badgeBg: '#00201d',
      badgeText: '#63f9e8',
      previewGradient: {
        start: '#110068',
        mid: '#005049',
        end: '#63f9e8',
      },
    },
  ];

  readonly palettes = signal<readonly ColorPalette[]>(this.defaultPalettes);
  readonly mode = signal<InputMode>('url');
  readonly rawValue = signal<string>('https://instagram.com/monbistro');
  readonly selectedPaletteId = signal<string>('violet-pop');
  readonly bottomText = signal<string>('REJOIGNEZ LA COMMUNAUTÉ ✨');
  readonly status = signal<GeneratorStatus>({ kind: 'idle' });

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  // Alias rétrocompatible pour les bindings existants
  readonly url = computed<string>(() => this.rawValue());

  readonly selectedPalette = computed<ColorPalette>(() => {
    const currentId = this.selectedPaletteId();
    return this.palettes().find((p) => p.id === currentId) ?? this.palettes()[0];
  });

  readonly payload = computed<QrPayload>(() => {
    const currentMode = this.mode();
    const raw = this.rawValue().trim();

    switch (currentMode) {
      case 'url': {
        const fallbackUrl = 'https://instagram.com/monbistro';
        const effectiveRaw = raw.length > 0 ? raw : fallbackUrl;
        const targetUrl = effectiveRaw.match(/^https?:\/\//i)
          ? effectiveRaw
          : `https://${effectiveRaw}`;
        return {
          kind: 'url',
          rawUrl: effectiveRaw,
          targetUrl,
        };
      }
      case 'text': {
        const fallbackText = 'QRCraft VIP Wi-Fi';
        const effectiveText = raw.length > 0 ? raw : fallbackText;
        return {
          kind: 'text',
          content: effectiveText,
        };
      }
      default: {
        const _exhaustiveCheck: never = currentMode;
        throw new Error(`Mode non supporté: ${String(_exhaustiveCheck)}`);
      }
    }
  });

  readonly displayUrl = computed<string>(() => {
    const p = this.payload();
    switch (p.kind) {
      case 'url':
        return p.targetUrl.replace(/^https?:\/\//i, '');
      case 'text':
        return p.content;
      default: {
        const _exhaustiveCheck: never = p;
        throw new Error(`Payload non supporté: ${JSON.stringify(_exhaustiveCheck)}`);
      }
    }
  });

  readonly isGenerating = computed<boolean>(() => this.status().kind === 'generating');

  readonly qrSvgMarkup = computed<string>(() => {
    const s = this.status();
    switch (s.kind) {
      case 'ready':
        return s.svgMarkup;
      case 'idle':
      case 'generating':
      case 'error':
        return '';
      default: {
        const _exhaustiveCheck: never = s;
        throw new Error(`Statut non supporté: ${JSON.stringify(_exhaustiveCheck)}`);
      }
    }
  });

  constructor() {
    this.scheduleRegeneration(0);
  }

  setMode(newMode: InputMode): void {
    if (this.mode() === newMode) return;
    this.mode.set(newMode);
    if (newMode === 'text' && this.rawValue().startsWith('https://')) {
      this.rawValue.set('Wi-Fi VIP: Palace_Meurice | Clé: Palace2026!');
    } else if (newMode === 'url' && !this.rawValue().includes('.')) {
      this.rawValue.set('https://instagram.com/monbistro');
    }
    this.scheduleRegeneration(0);
  }

  setValue(newValue: string): void {
    this.rawValue.set(newValue);
    this.scheduleRegeneration(150);
  }

  setUrl(newUrl: string): void {
    this.setValue(newUrl);
  }

  selectPalette(paletteId: string): void {
    this.selectedPaletteId.set(paletteId);
    this.scheduleRegeneration(0);
  }

  setBottomText(newText: string): void {
    this.bottomText.set(newText);
  }

  async regenerateQr(): Promise<void> {
    this.status.set({ kind: 'generating' });

    try {
      const p = this.payload();
      const dataToEncode = p.kind === 'url' ? p.targetUrl : p.content;
      const palette = this.selectedPalette();

      const options: QrEngineOptions = {
        width: 280,
        height: 280,
        data: dataToEncode,
        margin: 8,
        image: QR_CENTRAL_LOGO_BASE64,
        qrOptions: {
          typeNumber: 0,
          errorCorrectionLevel: 'H',
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: 0.28,
          margin: 4,
        },
        dotsOptions: {
          type: 'rounded',
          gradient: {
            type: 'linear',
            rotation: 45,
            colorStops: [
              { offset: 0, color: palette.previewGradient.start },
              { offset: 1, color: palette.previewGradient.end },
            ],
          },
        },
        cornersSquareOptions: {
          type: 'extra-rounded',
          gradient: {
            type: 'linear',
            rotation: 45,
            colorStops: [
              { offset: 0, color: palette.previewGradient.start },
              { offset: 1, color: palette.previewGradient.end },
            ],
          },
        },
        cornersDotOptions: {
          type: 'dot',
          color: palette.previewGradient.start,
        },
        backgroundOptions: {
          color: '#ffffff',
        },
      };

      const svgMarkup = await this.qrEngine.getSvgString(options);
      this.status.set({ kind: 'ready', svgMarkup });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de génération SVG';
      this.status.set({ kind: 'error', errorMessage });
    }
  }

  async downloadSvg(): Promise<void> {
    const p = this.payload();
    const dataToEncode = p.kind === 'url' ? p.targetUrl : p.content;
    const palette = this.selectedPalette();
    const filename = p.kind === 'url' ? 'qrcraft-live-url' : 'qrcraft-live-text';

    const options: QrEngineOptions = {
      width: 600,
      height: 600,
      data: dataToEncode,
      margin: 12,
      image: QR_CENTRAL_LOGO_BASE64,
      qrOptions: {
        typeNumber: 0,
        errorCorrectionLevel: 'H',
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.28,
        margin: 6,
      },
      dotsOptions: {
        type: 'rounded',
        gradient: {
          type: 'linear',
          rotation: 45,
          colorStops: [
            { offset: 0, color: palette.previewGradient.start },
            { offset: 1, color: palette.previewGradient.end },
          ],
        },
      },
      cornersSquareOptions: {
        type: 'extra-rounded',
        gradient: {
          type: 'linear',
          rotation: 45,
          colorStops: [
            { offset: 0, color: palette.previewGradient.start },
            { offset: 1, color: palette.previewGradient.end },
          ],
        },
      },
      cornersDotOptions: {
        type: 'dot',
        color: palette.previewGradient.start,
      },
      backgroundOptions: {
        color: '#ffffff',
      },
    };

    await this.qrEngine.download(options, filename, 'svg');
  }

  private scheduleRegeneration(delayMs: number): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    if (delayMs > 0) {
      this.debounceTimer = setTimeout(() => {
        void this.regenerateQr();
      }, delayMs);
    } else {
      void this.regenerateQr();
    }
  }
}
