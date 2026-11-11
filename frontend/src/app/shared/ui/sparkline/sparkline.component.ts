import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { sparklineAreaPath, sparklinePath } from '../../../core/utils/sparkline-path';

/**
 * Courbe miniature décorative (FR-011). La valeur chiffrée est toujours
 * donnée en texte à côté : la courbe elle-même est masquée aux lecteurs
 * d'écran (FR-039).
 */
@Component({
  selector: 'qc-sparkline',
  templateUrl: './sparkline.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SparklineComponent {
  readonly points = input.required<readonly number[]>();
  readonly width = input<number>(194);
  readonly height = input<number>(56);
  readonly strokeWidth = input<number>(2.5);
  readonly fillOpacity = input<number>(0.15);
  /** Occupe toute la largeur du conteneur, en déformant le viewBox. */
  readonly fluid = input<boolean>(false);

  protected readonly line = computed(() => sparklinePath(this.points(), this.width(), this.height()));
  protected readonly area = computed(() => sparklineAreaPath(this.points(), this.width(), this.height()));
}
