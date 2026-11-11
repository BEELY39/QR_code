import { Directive, booleanAttribute, computed, input } from '@angular/core';

export type QcButtonVariant = 'primary' | 'dark' | 'outline' | 'ghost-dark' | 'light';
export type QcButtonSize = 'md' | 'lg';

const BASE =
  'inline-flex items-center justify-center gap-2.5 font-semibold rounded-qc-md no-underline cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qc-accent';

const VARIANT: Readonly<Record<QcButtonVariant, string>> = {
  primary: 'bg-qc-accent text-white hover:bg-qc-accent-hover',
  dark: 'bg-qc-ink text-white hover:bg-qc-ink-2',
  light: 'bg-white text-qc-text hover:bg-qc-surface',
  outline: 'border border-qc-text text-qc-text bg-transparent hover:bg-qc-surface',
  'ghost-dark': 'border border-qc-outline-on-dark text-white bg-transparent hover:bg-qc-ink-2',
};

const SIZE: Readonly<Record<QcButtonSize, string>> = {
  md: 'h-11 px-5 text-qc-body-sm',
  lg: 'h-13 px-6 text-qc-body',
};

/**
 * Variantes de bouton (FR-005). Directive et non composant : elle ne pose que
 * des classes sur un `<button>` ou un `<a>` natif, qui gardent leur sémantique,
 * leur focus clavier et leur activation.
 */
@Directive({
  selector: 'button[qcButton], a[qcButton]',
  host: { '[class]': 'classes()' },
})
export class ButtonDirective {
  /** `''` ⇒ attribut nu (`<a qcButton>`), traité comme `primary`. */
  readonly qcButton = input<QcButtonVariant | ''>('primary');
  readonly qcSize = input<QcButtonSize>('lg');
  readonly qcBlock = input(false, { transform: booleanAttribute });

  protected readonly classes = computed(() => {
    const requested = this.qcButton();
    const variant: QcButtonVariant = requested === '' ? 'primary' : requested;
    return [BASE, VARIANT[variant], SIZE[this.qcSize()], this.qcBlock() ? 'w-full' : ''].join(' ');
  });
}
