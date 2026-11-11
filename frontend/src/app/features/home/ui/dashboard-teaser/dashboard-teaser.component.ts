import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { SegmentedComponent } from '../../../../shared/ui/segmented/segmented.component';
import { KpiTileComponent } from '../../../../shared/ui/kpi-tile/kpi-tile.component';
import { SparklineComponent } from '../../../../shared/ui/sparkline/sparkline.component';
import { SAMPLE_CAMPAIGN_TEASER } from '../../../../core/constants/sample-stats.constant';
import { NavLink } from '../../../../core/models/landing-content.model';
import { SampleCampaignTeaser } from '../../../../core/models/sample-stats.model';
import { LANDING_CONTENT } from '../../../../core/constants/landing.constant';

/**
 * Aperçu illustratif du tableau de bord. Le sélecteur de plage est visible et
 * annoncé au clavier, mais inerte côté données : il n'y a pas encore d'API.
 */
@Component({
  selector: 'app-dashboard-teaser',
  standalone: true,
  imports: [SegmentedComponent, KpiTileComponent, SparklineComponent],
  templateUrl: './dashboard-teaser.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTeaserComponent {
  readonly data = input<SampleCampaignTeaser>(SAMPLE_CAMPAIGN_TEASER);
  readonly label = input<string>(LANDING_CONTENT.teaserLabel);
  readonly dashboardLink = input<NavLink>(LANDING_CONTENT.tracker.cta);

  /** Plage sélectionnée : état local, aucun chargement déclenché. */
  readonly selectedRange = signal<number>(SAMPLE_CAMPAIGN_TEASER.activeRangeIndex);

  selectRange(index: number): void {
    this.selectedRange.set(index);
  }
}
