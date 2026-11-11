import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { LANDING_CONTENT } from '../../../../core/constants/landing.constant';
import { PrivacyContent } from '../../../../core/models/landing-content.model';

/** Bloc confidentialité : statistiques sans pistage (RGPD). */
@Component({
  selector: 'app-privacy-note',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './privacy-note.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyNoteComponent {
  readonly content = input<PrivacyContent>(LANDING_CONTENT.privacy);
}
