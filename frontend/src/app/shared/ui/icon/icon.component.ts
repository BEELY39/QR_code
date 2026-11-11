import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ICON_REGISTRY } from '../../../core/constants/icon.constant';
import { IconName } from '../../../core/models/icon.model';

/**
 * Icône unique de la refonte (FR-012). Décorative par défaut ; porteuse de
 * sens si un libellé est fourni. La couleur vient de `currentColor`.
 */
@Component({
  selector: 'qc-icon',
  templateUrl: './icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input<number>(20);
  readonly strokeWidth = input<number>(2);
  /** `null` ⇒ décorative (aria-hidden). Sinon, image nommée (FR-039). */
  readonly label = input<string | null>(null);

  protected readonly definition = computed(() => ICON_REGISTRY[this.name()]);
}
