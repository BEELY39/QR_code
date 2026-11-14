import { TestBed } from '@angular/core/testing';
import { CanMatchFn, Route, Router, UrlSegment, UrlTree, provideRouter } from '@angular/router';
import { signal } from '@angular/core';

import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthStatus } from './auth.model';

describe('authGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));
  const segments = [new UrlSegment('app', {})];
  const route: Route = { path: 'app' };

  function setup(status: AuthStatus, afterRefresh: AuthStatus) {
    const statusSignal = signal<AuthStatus>(status);
    const refresh = vi.fn(async () => {
      statusSignal.set(afterRefresh);
      return null;
    });
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: { status: statusSignal, refresh } }],
    });
    return { refresh };
  }

  it('laisse passer un utilisateur connecté sans appel réseau', async () => {
    const { refresh } = setup('authenticated', 'authenticated');
    expect(await executeGuard(route, segments)).toBe(true);
    expect(refresh).not.toHaveBeenCalled();
  });

  it('vérifie la session une fois si l’état est inconnu, puis laisse passer', async () => {
    const { refresh } = setup('unknown', 'authenticated');
    expect(await executeGuard(route, segments)).toBe(true);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it('renvoie un visiteur anonyme vers /connexion avec la page demandée', async () => {
    setup('anonymous', 'anonymous');
    const result = await executeGuard(route, segments);

    expect(result).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/connexion?retour=%2Fapp');
  });
});
