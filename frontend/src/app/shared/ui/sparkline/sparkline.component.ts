import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  SparklineOptions,
  SparklineScale,
  sparklineAreaPath,
  sparklinePath,
} from '../../../core/utils/sparkline-path';

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
  /** Échelle verticale fixe (sinon adaptée à la série). */
  readonly scale = input<SparklineScale | undefined>(undefined);
  /** Abscisses fixes dans les unités du viewBox (sinon espacement régulier). */
  readonly xs = input<readonly number[] | undefined>(undefined);
  /** Occupe toute la largeur du conteneur, en déformant le viewBox. */
  readonly fluid = input<boolean>(false);

  private readonly options = computed<SparklineOptions>(() => ({
    scale: this.scale(),
    xs: this.xs(),
  }));

  protected readonly line = computed(() =>
    sparklinePath(this.points(), this.width(), this.height(), this.options())
  );
  protected readonly area = computed(() =>
    sparklineAreaPath(this.points(), this.width(), this.height(), this.options())
  );
}
