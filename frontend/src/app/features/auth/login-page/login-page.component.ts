import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GoogleSigninButtonDirective, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { filter, map } from 'rxjs';

import { AuthService } from '../../../core/auth/auth.service';
import { AuthError } from '../../../core/auth/auth-error';
import { AuthErrorCode } from '../../../core/auth/auth.model';
import { GOOGLE_CLIENT_ID } from '../../../core/auth/google-client-id.token';
import { IconComponent } from '../../../shared/ui/icon/icon.component';

export type LoginMode = 'signin' | 'signup';

/** Destination par défaut après connexion. */
const APP_HOME = '/app';

const ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  invalid_request: 'La connexion Google a échoué. Réessayez.',
  invalid_google_token: 'La connexion Google a échoué. Réessayez.',
  email_not_verified: 'Votre adresse Google n’est pas vérifiée.',
  google_unavailable: 'Connexion impossible pour le moment. Réessayez dans un instant.',
  network: 'Connexion impossible pour le moment. Réessayez dans un instant.',
};

/**
 * Écran `/connexion` · `/inscription` (smart) : bouton Google officiel, puis remise de la preuve
 * d'identité à l'API (contracts/frontend-auth.md). Le module Google n'est sollicité que dans le
 * navigateur, après le premier rendu (principe V).
 */
@Component({
  selector: 'app-login-page',
  imports: [RouterLink, GoogleSigninButtonDirective, IconComponent],
  templateUrl: './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);

  readonly mode = signal<LoginMode>(this.route.snapshot.data['mode'] === 'signup' ? 'signup' : 'signin');
  readonly googleConfigured = inject(GOOGLE_CLIENT_ID).trim().length > 0;
  readonly errorMessage = signal<string | null>(null);
  readonly busy = signal(false);
  readonly isSignup = computed(() => this.mode() === 'signup');

  constructor() {
    if (this.googleConfigured) {
      afterNextRender(() => this.listenToGoogle());
    }
  }

  private listenToGoogle(): void {
    this.injector
      .get(SocialAuthService)
      .authState.pipe(
        map((user: SocialUser | null) => user?.idToken),
        filter((idToken): idToken is string => typeof idToken === 'string' && idToken.length > 0),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((idToken) => void this.completeLogin(idToken));
  }

  private async completeLogin(idToken: string): Promise<void> {
    this.errorMessage.set(null);
    this.busy.set(true);
    try {
      const { newAccount } = await this.auth.loginWithGoogle(idToken);
      await this.router.navigateByUrl(this.returnUrl(), { state: { newAccount } });
    } catch (error) {
      const code: AuthErrorCode = error instanceof AuthError ? error.code : 'network';
      this.errorMessage.set(ERROR_MESSAGES[code]);
    } finally {
      this.busy.set(false);
    }
  }

  /** Seules les pages de l'espace connecté sont acceptées : pas de redirection ouverte. */
  private returnUrl(): string {
    const retour = this.route.snapshot.queryParamMap.get('retour');
    const isAppPath = retour !== null && (retour === APP_HOME || retour.startsWith(`${APP_HOME}/`));
    return isAppPath ? retour : APP_HOME;
  }
}
