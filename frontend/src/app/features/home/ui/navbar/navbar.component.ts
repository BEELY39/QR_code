import { Component, computed, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from '../../../../shared/ui/button/button.directive';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { LANDING_CONTENT } from '../../../../core/constants/landing.constant';
import { NavLink } from '../../../../core/models/landing-content.model';
import { AppUser } from '../../../../core/auth/auth.model';

/**
 * Navigation de la landing. Desktop : liens + deux boutons, non collante.
 * Mobile (< 900 px) : logo, « Connexion », bouton de menu, collante (FR-024).
 * Connecté : avatar, nom et « Mon espace » à la place de « Se connecter » / « Créer un compte ».
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, ButtonDirective, IconComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  readonly links = input<readonly NavLink[]>(LANDING_CONTENT.nav);
  readonly authLink = input<NavLink>(LANDING_CONTENT.navAuth);
  readonly signupLink = input<NavLink>(LANDING_CONTENT.navSignup);

  /** Utilisateur connecté, fourni par le conteneur `app-site-header` ; `null` = visiteur anonyme. */
  readonly user = input<AppUser | null>(null);

  /** Clic sur « Se déconnecter » ; le conteneur appelle le service d'authentification. */
  readonly logout = output<void>();

  /** Initiale affichée quand Google ne fournit pas de photo. */
  readonly initial = computed(() => this.user()?.displayName.trim().charAt(0).toUpperCase() || '?');

  /** Panneau de navigation mobile (masqué à partir de 901 px). */
  readonly menuOpen = signal(false);

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
export { NavbarComponent as Navbar };
