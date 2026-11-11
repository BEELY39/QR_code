import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type QcBadgeVariant = 'success' | 'neutral' | 'accent' | 'warning' | 'success-on-dark';
export type QcBadgeShape = 'pill' | 'square';

const BASE =
  'inline-flex items-center gap-1.5 px-2.5 py-1 text-qc-caption font-semibold leading-none whitespace-nowrap';

const VARIANT: Readonly<Record<QcBadgeVariant, string>> = {
  success: 'text-qc-success bg-qc-success-bg',
  neutral: 'text-qc-ink-soft bg-qc-neutral-bg',
  accent: 'text-white bg-qc-accent',
  warning: 'text-qc-warning bg-qc-warning-bg',
  'success-on-dark': 'text-qc-success-on-dark bg-qc-live/12',
};

const SHAPE: Readonly<Record<QcBadgeShape, string>> = {
  pill: 'rounded-qc-pill',
  square: 'rounded-qc-chip',
};

/** Badge d'état ou de variation (FR-007). */
@Component({
  selector: 'qc-badge',
  template: `<span [class]="classes()"><ng-content /></span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  readonly variant = input<QcBadgeVariant>('neutral');
  readonly shape = input<QcBadgeShape>('pill');

  protected readonly classes = computed(() =>
    [BASE, VARIANT[this.variant()], SHAPE[this.shape()]].join(' ')
  );
}
