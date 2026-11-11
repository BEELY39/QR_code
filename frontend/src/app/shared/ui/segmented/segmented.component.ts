import { ChangeDetectionStrategy, Component, ElementRef, computed, input, output, viewChildren } from '@angular/core';

export type QcSegmentedTone = 'light' | 'dark';

const TRACK: Readonly<Record<QcSegmentedTone, string>> = {
  light: 'inline-flex gap-1 p-1 rounded-qc-md bg-qc-neutral-bg',
  dark: 'inline-flex gap-2',
};

const OPTION_BASE = 'px-[18px] py-[9px] rounded-qc-inner text-qc-ui cursor-pointer transition-colors';

const OPTION_ACTIVE: Readonly<Record<QcSegmentedTone, string>> = {
  light: 'bg-white text-qc-text font-semibold shadow-sm',
  dark: 'bg-white text-qc-ink font-semibold',
};

const OPTION_INACTIVE: Readonly<Record<QcSegmentedTone, string>> = {
  light: 'text-qc-muted font-medium',
  dark: 'text-qc-on-dark-muted font-medium border border-qc-ink-line',
};

/**
 * Sélecteur segmenté (FR-009). Sans état interne : le parent tient
 * `activeIndex`. Navigation aux flèches, un seul arrêt de tabulation.
 */
@Component({
  selector: 'qc-segmented',
  templateUrl: './segmented.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SegmentedComponent {
  readonly options = input.required<readonly string[]>();
  readonly activeIndex = input<number>(0);
  readonly tone = input<QcSegmentedTone>('light');

  readonly selected = output<number>();

  private readonly tabs = viewChildren<ElementRef<HTMLButtonElement>>('tab');

  protected readonly trackClass = computed(() => TRACK[this.tone()]);

  protected optionClass(index: number): string {
    const state = index === this.activeIndex() ? OPTION_ACTIVE[this.tone()] : OPTION_INACTIVE[this.tone()];
    return `${OPTION_BASE} ${state}`;
  }

  protected select(index: number): void {
    this.selected.emit(index);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const last = this.options().length - 1;
    const current = this.activeIndex();
    let next: number;

    switch (event.key) {
      case 'ArrowRight':
        next = current >= last ? 0 : current + 1;
        break;
      case 'ArrowLeft':
        next = current <= 0 ? last : current - 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = last;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.select(next);
    this.tabs()[next]?.nativeElement.focus();
  }
}
