import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LANDING_CONTENT } from '../../../../core/constants/landing.constant';

/** Bandeau « Un même outil pour » : puces en ligne (desktop), défilement horizontal (mobile). */
@Component({
  selector: 'app-use-cases-strip',
  standalone: true,
  templateUrl: './use-cases-strip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseCasesStripComponent {
  readonly chips = input<readonly string[]>(LANDING_CONTENT.useCases);
  readonly chipsMobile = input<readonly string[]>(LANDING_CONTENT.useCasesMobile);
}
