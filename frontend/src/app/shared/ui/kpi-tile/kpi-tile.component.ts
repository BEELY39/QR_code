import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { QcBadgeVariant } from '../badge/badge.component';

export type QcKpiSize = 'lg' | 'md';
export type QcKpiTone = 'light' | 'dark';

const TILE: Readonly<Record<QcKpiTone, string>> = {
  light: 'bg-white border border-qc-line text-qc-text',
  dark: 'bg-qc-ink-2 text-white',
};

const LABEL: Readonly<Record<QcKpiTone, string>> = {
  light: 'text-qc-muted',
  dark: 'text-qc-on-dark-muted',
};

const VALUE: Readonly<Record<QcKpiSize, string>> = {
  lg: 'text-qc-num-lg',
  md: 'text-qc-num-sm',
};

const DELTA: Readonly<Record<QcBadgeVariant, string>> = {
  success: 'text-qc-success bg-qc-success-bg',
  neutral: 'text-qc-ink-soft bg-qc-neutral-bg',
  accent: 'text-white bg-qc-accent',
  warning: 'text-qc-warning bg-qc-warning-bg',
  'success-on-dark': 'text-qc-success-on-dark bg-qc-live/12',
};

/**
 * Tuile de chiffre-clé (FR-010). Le mini-visuel s'insère par `<ng-content>`.
 * `value` est déjà formaté : deux tuiles de la landing affichent du texte.
 */
@Component({
  selector: 'qc-kpi-tile',
  templateUrl: './kpi-tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiTileComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly size = input<QcKpiSize>('lg');
  readonly delta = input<string | null>(null);
  readonly deltaVariant = input<QcBadgeVariant>('neutral');
  readonly tone = input<QcKpiTone>('dark');

  protected readonly tileClass = computed(
    () => `flex flex-col gap-1.5 rounded-qc-card p-5 ${TILE[this.tone()]}`
  );
  protected readonly labelClass = computed(() => `text-qc-meta ${LABEL[this.tone()]}`);
  protected readonly valueClass = computed(
    () => `font-qc-display font-bold leading-none ${VALUE[this.size()]}`
  );
  protected readonly deltaClass = computed(
    () =>
      `inline-flex self-start px-2.5 py-1 rounded-qc-pill text-qc-caption font-semibold ${DELTA[this.deltaVariant()]}`
  );
}
