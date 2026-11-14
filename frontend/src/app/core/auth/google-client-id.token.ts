import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

/** Identifiant client OAuth Google — public par nature ; vide = connexion Google non configurée. */
export const GOOGLE_CLIENT_ID = new InjectionToken<string>('GOOGLE_CLIENT_ID', {
  providedIn: 'root',
  factory: () => environment.googleClientId,
});
