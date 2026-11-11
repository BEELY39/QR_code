import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ButtonDirective } from '../../../../shared/ui/button/button.directive';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { SparklineComponent } from '../../../../shared/ui/sparkline/sparkline.component';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';
import { LANDING_CONTENT } from '../../../../core/constants/landing.constant';
import {
  SAMPLE_HERO_CARD,
  SAMPLE_HERO_SERIES,
  SAMPLE_LAST_SCAN,
} from '../../../../core/constants/sample-stats.constant';
import { HeroContent } from '../../../../core/models/landing-content.model';
import {
  SampleHeroCard,
  SampleLastScan,
  SampleScanSeries,
} from '../../../../core/models/sample-stats.model';

/**
 * Hero de la landing. Visuel illustratif statique (QR d'exemple, cartes de
 * chiffres marquées « Données d'exemple ») : desktop = trois cartes flottantes,
 * mobile = une seule carte (FR-025).
 */
@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [ButtonDirective, IconComponent, SparklineComponent, BadgeComponent],
  templateUrl: './hero-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSectionComponent {
  readonly content = input<HeroContent>(LANDING_CONTENT.hero);
  readonly card = input<SampleHeroCard>(SAMPLE_HERO_CARD);
  readonly scans = input<SampleScanSeries>(SAMPLE_HERO_SERIES);
  readonly lastScan = input<SampleLastScan>(SAMPLE_LAST_SCAN);

  /** Points de la courbe du hero, déjà dans l'échelle de la maquette. */
  protected readonly scanPoints = computed(() => this.scans().points);
}
