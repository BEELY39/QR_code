import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Puce de tag monospace sur fond d'accent clair (FR-008). */
@Component({
  selector: 'qc-tag-chip',
  template: `<span class="inline-flex items-center px-2.5 py-[5px] rounded-qc-chip font-qc-mono text-qc-meta bg-qc-accent-soft text-qc-accent-hover"><ng-content /></span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagChipComponent {}
