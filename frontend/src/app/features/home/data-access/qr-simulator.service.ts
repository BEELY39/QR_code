import { Injectable, computed, signal } from '@angular/core';
import { ColorPalette } from '../../../core/models/palette.model';

@Injectable({
  providedIn: 'root',
})
export class QrSimulatorService {
  private readonly defaultPalettes: ColorPalette[] = [
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

  readonly palettes = signal<ColorPalette[]>(this.defaultPalettes);
  readonly url = signal<string>('https://instagram.com/monbistro');
  readonly selectedPaletteId = signal<string>('violet-pop');
  readonly bottomText = signal<string>('REJOIGNEZ LA COMMUNAUTÉ ✨');

  readonly selectedPalette = computed<ColorPalette>(() => {
    const currentId = this.selectedPaletteId();
    return this.palettes().find((p) => p.id === currentId) ?? this.palettes()[0];
  });

  readonly displayUrl = computed<string>(() => {
    return this.url().replace(/^https?:\/\//, '');
  });

  setUrl(newUrl: string): void {
    this.url.set(newUrl);
  }

  selectPalette(paletteId: string): void {
    this.selectedPaletteId.set(paletteId);
  }

  setBottomText(newText: string): void {
    this.bottomText.set(newText);
  }
}
