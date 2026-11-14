import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AuthService } from '../../../core/auth/auth.service';
import { NavbarComponent } from '../../../features/home/ui/navbar/navbar.component';

/**
 * En-tête des pages publiques (smart) : lit l'état d'authentification et le transmet à la barre
 * de navigation, qui reste un composant de présentation (constitution, principe IV).
 */
@Component({
  selector: 'app-site-header',
  imports: [NavbarComponent],
  templateUrl: './site-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeaderComponent {
  readonly auth = inject(AuthService);
}
