import { HttpErrorResponse } from '@angular/common/http';
import { AuthError } from './auth-error';

describe('AuthError', () => {
  it('reprend le code renvoyé par l’API', () => {
    const error = AuthError.fromHttp(
      new HttpErrorResponse({ status: 403, error: { error: 'email_not_verified' } })
    );
    expect(error.code).toBe('email_not_verified');
  });

  it('classe une API injoignable en erreur réseau', () => {
    expect(AuthError.fromHttp(new HttpErrorResponse({ status: 0 })).code).toBe('network');
  });

  it('classe un code inconnu en jeton Google invalide', () => {
    const error = AuthError.fromHttp(new HttpErrorResponse({ status: 401, error: { error: 'autre' } }));
    expect(error.code).toBe('invalid_google_token');
  });
});
