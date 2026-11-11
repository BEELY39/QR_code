import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type QcCardTone = 'light' | 'dark' | 'surface';
export type QcCardRadius = 'card' | 'card-lg' | 'xl' | 'panel';
export type QcCardPadding = 'sm' | 'md' | 'lg';

const TONE: Readonly<Record<QcCardTone, string>> = {
  light: 'bg-white border border-qc-line',
  dark: 'bg-qc-ink-2 border border-qc-ink-line text-white',
  surface: 'bg-qc-surface',
};

const RADIUS: Readonly<Record<QcCardRadius, string>> = {
  card: 'rounded-qc-card',
  'card-lg': 'rounded-qc-card-lg',
  xl: 'rounded-qc-xl',
  panel: 'rounded-qc-panel',
};

const PADDING: Readonly<Record<QcCardPadding, string>> = {
  sm: 'p-5',
  md: 'p-7',
  lg: 'p-10',
};

/** Carte de présentation : surface bordée, sans logique métier (FR-006). */
@Component({
  selector: 'qc-card',
  template: `<div [class]="classes()"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  readonly tone = input<QcCardTone>('light');
  readonly radius = input<QcCardRadius>('card-lg');
  readonly padding = input<QcCardPadding>('md');

  protected readonly classes = computed(() =>
    [TONE[this.tone()], RADIUS[this.radius()], PADDING[this.padding()]].join(' ')
  );
}
