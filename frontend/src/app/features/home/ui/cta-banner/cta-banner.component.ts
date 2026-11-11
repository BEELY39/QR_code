import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ButtonDirective } from '../../../../shared/ui/button/button.directive';
import { LANDING_CONTENT } from '../../../../core/constants/landing.constant';

/** Appel à l'action final, en aplat d'accent. Les deux CTA mènent au Studio (FR-022). */
@Component({
  selector: 'app-cta-banner',
  standalone: true,
  imports: [ButtonDirective],
  templateUrl: './cta-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CtaBannerComponent {
  readonly content = input<typeof LANDING_CONTENT.cta>(LANDING_CONTENT.cta);
}
export { CtaBannerComponent as CtaBanner };
