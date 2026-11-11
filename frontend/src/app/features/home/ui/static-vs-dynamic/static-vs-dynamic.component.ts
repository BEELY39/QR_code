import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ButtonDirective } from '../../../../shared/ui/button/button.directive';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { LANDING_CONTENT } from '../../../../core/constants/landing.constant';
import {
  OfferCard,
  OfferCardMobile,
  SectionHeading,
} from '../../../../core/models/landing-content.model';

/** Comparatif QR statique / dynamique (maquette Main, bloc STATIC vs DYNAMIC). */
@Component({
  selector: 'app-static-vs-dynamic',
  standalone: true,
  imports: [ButtonDirective, BadgeComponent, IconComponent],
  templateUrl: './static-vs-dynamic.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaticVsDynamicComponent {
  readonly heading = input<SectionHeading>(LANDING_CONTENT.staticVsDynamic);
  readonly offers = input<readonly OfferCard[]>(LANDING_CONTENT.offers);
  readonly offersMobile = input<readonly OfferCardMobile[]>(LANDING_CONTENT.offersMobile);
}
