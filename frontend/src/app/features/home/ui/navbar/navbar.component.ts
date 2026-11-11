import { Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from '../../../../shared/ui/button/button.directive';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { LANDING_CONTENT } from '../../../../core/constants/landing.constant';
import { NavLink } from '../../../../core/models/landing-content.model';

/**
 * Navigation de la landing. Desktop : liens + deux boutons, non collante.
 * Mobile (< 900 px) : logo, « Connexion », bouton de menu, collante (FR-024).
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
