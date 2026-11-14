import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

import { AuthService } from './auth.service';

/**
 * Réserve l'espace `/app` aux personnes connectées. Si l'état n'est pas « connecté », la session
 * est vérifiée une fois auprès de l'API avant de décider (rechargement de page, autre onglet).
 */
export const authGuard: CanMatchFn = async (_route, segments) => {
  // Toutes les injections avant le premier `await` : après, on n'est plus dans le contexte d'injection.
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.status() !== 'authenticated') {
    await auth.refresh();
  }
  if (auth.status() === 'authenticated') {
    return true;
  }
  const requested = '/' + segments.map((segment) => segment.path).join('/');
  return router.createUrlTree(['/connexion'], { queryParams: { retour: requested } });
};
