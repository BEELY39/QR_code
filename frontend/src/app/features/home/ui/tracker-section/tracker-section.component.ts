import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { DashboardTeaserComponent } from '../dashboard-teaser/dashboard-teaser.component';
import { LANDING_CONTENT } from '../../../../core/constants/landing.constant';
import { NavLink, TrackerPillar } from '../../../../core/models/landing-content.model';

/**
 * Présentation du tracker : où, quand, quel QR, quel appareil (ancre #tracker).
 * L'aperçu du tableau de bord fait partie de la même section, comme dans la maquette.
 */
@Component({
  selector: 'app-tracker-section',
  standalone: true,
  imports: [IconComponent, DashboardTeaserComponent],
  templateUrl: './tracker-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackerSectionComponent {
  readonly eyebrow = input<string>(LANDING_CONTENT.tracker.eyebrow);
  readonly title = input<string>(LANDING_CONTENT.tracker.title);
  readonly cta = input<NavLink>(LANDING_CONTENT.tracker.cta);
  readonly pillars = input<readonly TrackerPillar[]>(LANDING_CONTENT.trackerPillars);
}
