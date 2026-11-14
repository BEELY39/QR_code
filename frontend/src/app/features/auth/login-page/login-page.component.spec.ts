import { ComponentFixture, DeferBlockBehavior, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Subject } from 'rxjs';

import { LoginPageComponent } from './login-page.component';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthError } from '../../../core/auth/auth-error';
import { GOOGLE_CLIENT_ID } from '../../../core/auth/google-client-id.token';
import { LoginResponse } from '../../../core/auth/auth.model';

const RESPONSE: LoginResponse = {
  user: { id: 'u1', email: 'a@example.com', displayName: 'Alice', pictureUrl: null },
  newAccount: true,
};

function googleUser(idToken: string): SocialUser {
  const user = new SocialUser();
  user.idToken = idToken;
  return user;
}

describe('LoginPageComponent', () => {
  let fixture: ComponentFixture<LoginPageComponent>;
  let authState: Subject<SocialUser | null>;
  let loginWithGoogle: ReturnType<typeof vi.fn>;
  let navigateByUrl: ReturnType<typeof vi.spyOn>;

  async function setup(options: { mode?: 'signin' | 'signup'; retour?: string; clientId?: string } = {}) {
    authState = new Subject<SocialUser | null>();
    loginWithGoogle = vi.fn().mockResolvedValue(RESPONSE);

    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { loginWithGoogle } },
        { provide: SocialAuthService, useValue: { authState, initState: new Subject<boolean>() } },
        { provide: GOOGLE_CLIENT_ID, useValue: options.clientId ?? 'client-id-de-test' },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: { mode: options.mode ?? 'signin' },
              queryParamMap: convertToParamMap(options.retour ? { retour: options.retour } : {}),
            },
          },
        },
      ],
      deferBlockBehavior: DeferBlockBehavior.Manual,
    }).compileComponents();

    navigateByUrl = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    fixture = TestBed.createComponent(LoginPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  const text = (): string => (fixture.nativeElement as HTMLElement).textContent ?? '';
  const alert = (): HTMLElement | null => (fixture.nativeElement as HTMLElement).querySelector('[role="alert"]');

  it('affiche le titre de connexion par défaut', async () => {
    await setup();
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Se connecter');
  });

  it('affiche le titre d’inscription en mode signup', async () => {
    await setup({ mode: 'signup' });
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Créer votre compte');
  });

  it('ne propose aucun formulaire e-mail ni mot de passe', async () => {
    await setup({ mode: 'signup' });
    expect(fixture.nativeElement.querySelector('input[type="email"], input[type="password"]')).toBeNull();
  });

  it('connecte l’utilisateur puis l’envoie sur /app en signalant un nouveau compte', async () => {
    await setup();
    authState.next(googleUser('google-id-token'));
    await fixture.whenStable();

    expect(loginWithGoogle).toHaveBeenCalledWith('google-id-token');
    expect(navigateByUrl).toHaveBeenCalledWith('/app', { state: { newAccount: true } });
  });

  it('respecte le paramètre retour vers une page de l’espace connecté', async () => {
    await setup({ retour: '/app/campagnes/42' });
    authState.next(googleUser('tok'));
    await fixture.whenStable();

    expect(navigateByUrl).toHaveBeenCalledWith('/app/campagnes/42', { state: { newAccount: true } });
  });

  it('ignore un paramètre retour vers un autre site', async () => {
    await setup({ retour: 'https://evil.test/vol' });
    authState.next(googleUser('tok'));
    await fixture.whenStable();

    expect(navigateByUrl).toHaveBeenCalledWith('/app', { state: { newAccount: true } });
  });

  it('ignore un paramètre retour protocolaire relatif', async () => {
    await setup({ retour: '//evil.test' });
    authState.next(googleUser('tok'));
    await fixture.whenStable();

    expect(navigateByUrl).toHaveBeenCalledWith('/app', { state: { newAccount: true } });
  });

  it('affiche un message clair si l’adresse Google n’est pas vérifiée', async () => {
    await setup();
    loginWithGoogle.mockRejectedValue(new AuthError('email_not_verified'));
    authState.next(googleUser('tok'));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(alert()?.textContent).toContain('Votre adresse Google n’est pas vérifiée.');
    expect(navigateByUrl).not.toHaveBeenCalled();
  });

  it('affiche un message de réessai si l’API ou Google est indisponible', async () => {
    await setup();
    loginWithGoogle.mockRejectedValue(new AuthError('network'));
    authState.next(googleUser('tok'));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(alert()?.textContent).toContain('Connexion impossible pour le moment.');
  });

  it('signale une connexion Google non configurée au lieu d’afficher le bouton', async () => {
    await setup({ clientId: '' });
    expect(text()).toContain('Connexion Google non configurée');
  });
});
