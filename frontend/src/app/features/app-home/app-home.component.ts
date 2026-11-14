import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { IconComponent } from '../../shared/ui/icon/icon.component';

/**
 * Accueil provisoire de l'espace connecté `/app` (smart) : salue l'utilisateur et l'accueille
 * à la création de son compte. Le tableau de bord le remplacera.
 */
@Component({
  selector: 'app-app-home',
  imports: [RouterLink, IconComponent],
  templateUrl: './app-home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHomeComponent {
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly auth = inject(AuthService);

  /** Vrai juste après la création du compte (état transmis par la page de connexion). */
  readonly newAccount = signal(this.readNewAccountFlag());

  /** Initiale affichée quand Google ne fournit pas de photo. */
  initial(name: string): string {
    return name.trim().charAt(0).toUpperCase() || '?';
  }

  private readNewAccountFlag(): boolean {
    const fromNavigation = this.router.currentNavigation()?.extras.state?.['newAccount'];
    if (typeof fromNavigation === 'boolean') {
      return fromNavigation;
    }
    const fromHistory: unknown = this.isBrowser ? history.state?.newAccount : undefined;
    return fromHistory === true;
  }
}
