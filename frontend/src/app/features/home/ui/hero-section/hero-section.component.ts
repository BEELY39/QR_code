import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { QrEngineService } from '../../../../core/services/qr-engine.service';
import {
  DotType,
  CornerSquareType,
  CornerDotType,
  QrEngineOptions,
} from '../../../../core/models/qr-engine.model';

export interface HeroDotStyleConfig {
  readonly id: DotType;
  readonly label: string;
  readonly cornerSquare: CornerSquareType;
  readonly cornerDot: CornerDotType;
}

export const HERO_DOT_STYLES: readonly HeroDotStyleConfig[] = [
  {
    id: 'dots',
    label: 'Points circulaires',
    cornerSquare: 'extra-rounded',
    cornerDot: 'dot',
  },
  {
    id: 'classy-rounded',
    label: 'Points modernes',
    cornerSquare: 'extra-rounded',
    cornerDot: 'dot',
  },
  {
    id: 'rounded',
    label: 'Points arrondis',
    cornerSquare: 'extra-rounded',
    cornerDot: 'dot',
  },
  {
    id: 'square',
    label: 'Carré géométrique',
    cornerSquare: 'square',
    cornerDot: 'square',
  },
] as const;

export const HERO_QR_DATA = 'Bienvenue';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css',
})
export class HeroSectionComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly qrEngine = inject(QrEngineService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly isBrowser = isPlatformBrowser(this.platformId);
  readonly styles: readonly HeroDotStyleConfig[] = HERO_DOT_STYLES;

  readonly currentStyleIndex = signal<number>(0);
  readonly isTransitioning = signal<boolean>(false);
  readonly svgCache = signal<ReadonlyMap<DotType, SafeHtml>>(new Map());

  readonly currentStyle = computed<HeroDotStyleConfig>(() => {
    const index = this.currentStyleIndex();
    return this.styles[index] ?? this.styles[0];
  });

  readonly currentSvg = computed<SafeHtml | null>(() => {
    const style = this.currentStyle();
    return this.svgCache().get(style.id) ?? null;
  });

  private cycleIntervalId: ReturnType<typeof setInterval> | null = null;
  private transitionTimeoutId: ReturnType<typeof setTimeout> | null = null;

  async ngOnInit(): Promise<void> {
    if (!this.isBrowser) {
      return;
    }
    await this.initQrCodes();
    this.startCycle();
  }

  ngOnDestroy(): void {
    this.stopCycle();
  }

  async initQrCodes(): Promise<void> {
    // Génération prioritaire du premier style pour affichage immédiat
    const firstStyle = this.styles[0];
    const firstSvg = await this.generateSvg(firstStyle);
    if (firstSvg) {
      this.svgCache.update((cache) => new Map(cache).set(firstStyle.id, firstSvg));
    }

    // Pré-génération des styles suivants en arrière-plan pour fluidité totale
    for (const style of this.styles.slice(1)) {
      const svg = await this.generateSvg(style);
      if (svg) {
        this.svgCache.update((cache) => new Map(cache).set(style.id, svg));
      }
    }
  }

  startCycle(): void {
    if (this.cycleIntervalId) {
      return;
    }
    this.cycleIntervalId = setInterval(() => {
      this.switchStyle();
    }, 2800);
  }

  stopCycle(): void {
    if (this.cycleIntervalId) {
      clearInterval(this.cycleIntervalId);
      this.cycleIntervalId = null;
    }
    if (this.transitionTimeoutId) {
      clearTimeout(this.transitionTimeoutId);
      this.transitionTimeoutId = null;
    }
  }

  switchStyle(): void {
    this.isTransitioning.set(true);
    this.transitionTimeoutId = setTimeout(() => {
      this.currentStyleIndex.update((current) => (current + 1) % this.styles.length);
      this.isTransitioning.set(false);
    }, 200);
  }

  private async generateSvg(style: HeroDotStyleConfig): Promise<SafeHtml | null> {
    try {
      const options: QrEngineOptions = {
        width: 260,
        height: 260,
        data: HERO_QR_DATA,
        margin: 8,
        qrOptions: {
          typeNumber: 0,
          errorCorrectionLevel: 'M',
        },
        dotsOptions: {
          type: style.id,
          gradient: {
            type: 'linear',
            rotation: 45,
            colorStops: [
              { offset: 0, color: '#412ce7' },
              { offset: 0.6, color: '#7a3cf5' },
              { offset: 1, color: '#fe5b5b' },
            ],
          },
        },
        cornersSquareOptions: {
          type: style.cornerSquare,
          gradient: {
            type: 'linear',
            rotation: 45,
            colorStops: [
              { offset: 0, color: '#412ce7' },
              { offset: 0.6, color: '#7a3cf5' },
              { offset: 1, color: '#fe5b5b' },
            ],
          },
        },
        cornersDotOptions: {
          type: style.cornerDot,
          gradient: {
            type: 'linear',
            rotation: 45,
            colorStops: [
              { offset: 0, color: '#412ce7' },
              { offset: 0.6, color: '#7a3cf5' },
              { offset: 1, color: '#fe5b5b' },
            ],
          },
        },
        backgroundOptions: {
          color: '#ffffff',
        },
      };

      const rawSvg = await this.qrEngine.getSvgString(options);
      if (!rawSvg) {
        return null;
      }
      return this.sanitizer.bypassSecurityTrustHtml(rawSvg);
    } catch {
      return null;
    }
  }
}

export { HeroSectionComponent as HeroSection };

