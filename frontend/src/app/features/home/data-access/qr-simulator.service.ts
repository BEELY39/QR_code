import { Injectable, computed, inject, signal } from '@angular/core';
import { ColorPalette } from '../../../core/models/palette.model';
import { GeneratorStatus, InputMode, QrPayload, WifiConfig, QrDesignOptions } from '../../../core/models/live-qr.model';
import { formatWifiPayload } from '../../../core/utils/wifi-formatter';
import { QrEngineService } from '../../../core/services/qr-engine.service';
import { DomExportService } from '../../../core/services/dom-export.service';
import { QR_CENTRAL_LOGO_BASE64 } from '../../../core/constants/qr-logo.constant';
import { QrEngineOptions } from '../../../core/models/qr-engine.model';

@Injectable({
  providedIn: 'root',
})
export class QrSimulatorService {
  private readonly qrEngine = inject(QrEngineService);
  private readonly domExport = inject(DomExportService);

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

  readonly wifiConfig = signal<WifiConfig | null>(null);
  readonly design = signal<QrDesignOptions>({
    dotsStyle: 'rounded',
    dotsColor: { kind: 'single', color: '#000000' },
    cornersColor: '#000000',
    backgroundColor: '#ffffff',
    customLogoBase64: null,
    frame: {
      style: 'simple-bottom',
      text: 'SCAN ME',
      font: 'Roboto',
      frameColor: '#000000',
      textColor: '#ffffff',
    }
  });

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
      case 'wifi': {
        const fallbackConfig: WifiConfig = { ssid: 'QRCraft-Guest', encryption: 'WPA2', password: 'password123', hidden: false };
        const conf = this.wifiConfig() ?? fallbackConfig;
        return {
          kind: 'wifi',
          config: conf,
          rawString: formatWifiPayload(conf),
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
      case 'wifi':
        return `Wi-Fi: ${p.config.ssid}`;
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
    const palette = this.selectedPalette();
    this.design.update(d => ({
      ...d,
      dotsColor: {
        kind: 'gradient',
        gradient: {
          type: 'linear',
          rotation: 45,
          colorStops: [
            { offset: 0, color: palette.previewGradient.start },
            { offset: 1, color: palette.previewGradient.end }
          ]
        }
      },
      cornersColor: palette.previewGradient.start
    }));
    this.scheduleRegeneration(0);
  }

  setBottomText(newText: string): void {
    this.bottomText.set(newText);
    this.design.update(d => ({
      ...d,
      frame: { ...d.frame, text: newText },
    }));
  }

  setWifiConfig(config: WifiConfig): void {
    this.wifiConfig.set(config);
    if (this.mode() !== 'wifi') {
      this.mode.set('wifi');
    }
    this.scheduleRegeneration(150);
  }

  updateDesign(partialDesign: Partial<QrDesignOptions>): void {
    this.design.update(d => {
      const updatedFrame = partialDesign.frame ? { ...d.frame, ...partialDesign.frame } : d.frame;
      return {
        ...d,
        ...partialDesign,
        frame: updatedFrame,
      };
    });
    if (partialDesign.frame?.text !== undefined) {
      this.bottomText.set(partialDesign.frame.text);
    }
    this.scheduleRegeneration(150);
  }

  async regenerateQr(): Promise<void> {
    this.status.set({ kind: 'generating' });

    try {
      const p = this.payload();
      const dataToEncode = p.kind === 'url' ? p.targetUrl : (p.kind === 'text' ? p.content : p.rawString);
      const options = this.buildQrOptions(dataToEncode, false);
      const svgMarkup = await this.qrEngine.getSvgString(options);
      this.status.set({ kind: 'ready', svgMarkup });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de génération SVG';
      this.status.set({ kind: 'error', errorMessage });
    }
  }

  async downloadSvg(): Promise<void> {
    const p = this.payload();
    const dataToEncode = p.kind === 'url' ? p.targetUrl : (p.kind === 'text' ? p.content : p.rawString);
    const filename = p.kind === 'url' ? 'qrcraft-live-url' : (p.kind === 'text' ? 'qrcraft-live-text' : 'qrcraft-live-wifi');
    const d = this.design();

    // Si un cadre est actif et présent dans le DOM, capture et export SVG vectoriel complet
    if (d.frame.style !== 'none' && typeof document !== 'undefined') {
      const framedEl = document.getElementById('live-qr-framed-container');
      if (framedEl) {
        const result = await this.domExport.captureToSvg(framedEl, `${filename}-framed.svg`);
        this.domExport.saveAndRelease(result);
        return;
      }
    }

    const options = this.buildQrOptions(dataToEncode, true);
    await this.qrEngine.download(options, filename, 'svg');
  }

  async downloadPng(): Promise<void> {
    const p = this.payload();
    const dataToEncode = p.kind === 'url' ? p.targetUrl : (p.kind === 'text' ? p.content : p.rawString);
    const filename = p.kind === 'url' ? 'qrcraft-live-url' : (p.kind === 'text' ? 'qrcraft-live-text' : 'qrcraft-live-wifi');
    const d = this.design();

    // Si un cadre est actif et présent dans le DOM, capture et export PNG haute fidélité
    if (d.frame.style !== 'none' && typeof document !== 'undefined') {
      const framedEl = document.getElementById('live-qr-framed-container');
      if (framedEl) {
        const result = await this.domExport.captureToPng(framedEl, 3, `${filename}-framed.png`);
        this.domExport.saveAndRelease(result);
        return;
      }
    }

    const options = this.buildQrOptions(dataToEncode, true);
    await this.qrEngine.download(options, filename, 'png');
  }


  private buildQrOptions(dataToEncode: string, isDownload = false): QrEngineOptions {
    const d = this.design();
    // Convert readonly colorStops to mutable to satisfy qr-code-styling typing
    const dotsColorOpt = d.dotsColor.kind === 'single'
      ? { color: d.dotsColor.color }
      : { 
          gradient: {
            ...d.dotsColor.gradient,
            colorStops: d.dotsColor.gradient.colorStops.map(s => ({ ...s }))
          } 
        };

    return {
      width: isDownload ? 600 : 280,
      height: isDownload ? 600 : 280,
      data: dataToEncode,
      // Quiet zone : la norme ISO/IEC 18004 impose 4 modules de blanc autour du code.
      // À l'export sans cadre, rien n'entoure le QR : 12px (~0,7 module) faisait échouer
      // les scans à l'impression ou sur fond coloré. 60px ≈ 3,5 à 4 modules.
      // En aperçu, le cadre blanc (p-4/p-6) fournit déjà cette marge.
      margin: isDownload ? 60 : 8,
      image: d.customLogoBase64 || QR_CENTRAL_LOGO_BASE64,
      qrOptions: {
        typeNumber: 0,
        errorCorrectionLevel: 'H',
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.28,
        margin: isDownload ? 6 : 4,
      },
      dotsOptions: {
        type: d.dotsStyle,
        ...dotsColorOpt
      },
      cornersSquareOptions: {
        type: 'extra-rounded',
        color: d.cornersColor,
      },
      cornersDotOptions: {
        type: 'dot',
        color: d.cornersColor,
      },
      backgroundOptions: {
        color: d.backgroundColor,
      },
    };
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
