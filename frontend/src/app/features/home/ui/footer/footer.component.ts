import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LANDING_CONTENT } from '../../../../core/constants/landing.constant';

/** Pied de page : 4 colonnes en desktop, bloc de marque + liens en 2 colonnes en mobile (FR-030). */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  readonly content = input<typeof LANDING_CONTENT.footer>(LANDING_CONTENT.footer);
}
export { FooterComponent as Footer };
