import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LANDING_CONTENT } from '../../../../core/constants/landing.constant';
import { AdvertiserBenefit, SectionHeading } from '../../../../core/models/landing-content.model';

/** Bloc publicitaires : rapports, UTM, test A/B, destination modifiable. */
@Component({
  selector: 'app-advertisers-section',
  standalone: true,
  templateUrl: './advertisers-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvertisersSectionComponent {
  readonly heading = input<SectionHeading>(LANDING_CONTENT.advertisers);
  readonly benefits = input<readonly AdvertiserBenefit[]>(LANDING_CONTENT.advertiserBenefits);
}
