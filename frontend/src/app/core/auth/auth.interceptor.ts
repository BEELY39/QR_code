import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { API_BASE_URL } from './api-base-url.token';
import { AuthService } from './auth.service';

/** Appels dont le 401 est traité par l'appelant : connexion et vérification silencieuse. */
const SELF_HANDLED_PATHS = ['/api/auth/', '/api/me'];

/**
 * Joint le cookie de session aux appels vers l'API (et à eux seuls). Sur un 401 d'un appel
 * protégé, la session est considérée expirée et l'utilisateur renvoyé vers `/connexion`, avec la
 * page d'origine en paramètre `retour` (contracts/frontend-auth.md).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiBaseUrl = inject(API_BASE_URL);
  if (!req.url.startsWith(apiBaseUrl)) {
    return next(req);
  }

  const auth = inject(AuthService);
  const router = inject(Router);
  const path = req.url.slice(apiBaseUrl.length);

  return next(req.clone({ withCredentials: true })).pipe(
    catchError((error: unknown) => {
      const selfHandled = SELF_HANDLED_PATHS.some((prefix) => path.startsWith(prefix));
      if (error instanceof HttpErrorResponse && error.status === 401 && !selfHandled) {
        auth.markSessionExpired();
        void router.navigateByUrl(`/connexion?retour=${encodeURIComponent(router.url)}`);
      }
      return throwError(() => error);
    })
  );
};
