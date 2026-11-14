import { Routes } from '@angular/router';
import {
  GoogleLoginProvider,
  SOCIAL_AUTH_CONFIG,
  SocialAuthService,
  SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';

import { environment } from '../../../environments/environment';
import { LoginPageComponent } from './login-page/login-page.component';

/**
 * Fournisseurs Google déclarés **ici seulement** (principe V) : `SocialAuthService` est
 * `providedIn: 'root'` et charge le script Google dès sa création ; le re-fournir au niveau de
 * ces routes garantit qu'aucune autre page ne le crée. Pas de One Tap ni de connexion automatique.
 * Une fabrique par injecteur : chaque route a son propre fournisseur Google.
 */
function googleAuthConfig(): SocialAuthServiceConfig {
  return {
    autoLogin: false,
    lang: 'fr',
    providers: [
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider(environment.googleClientId, { oneTapEnabled: false }),
      },
    ],
  };
}

/**
 * Chargées sous `/connexion` et `/inscription` (cf. `app.routes.ts`) ; le mode `signin` / `signup`
 * est hérité de la route parente.
 */
export const AUTH_ROUTES: Routes = [
  {
    path: '',
    providers: [SocialAuthService, { provide: SOCIAL_AUTH_CONFIG, useFactory: googleAuthConfig }],
    component: LoginPageComponent,
  },
];
