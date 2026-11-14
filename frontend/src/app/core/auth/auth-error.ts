import { HttpErrorResponse } from '@angular/common/http';
import { AuthErrorCode } from './auth.model';

const API_CODES: readonly AuthErrorCode[] = [
  'invalid_request',
  'invalid_google_token',
  'email_not_verified',
  'google_unavailable',
];

/** Échec de connexion, avec le code stable renvoyé par l'API (contracts/auth-api.md). */
export class AuthError extends Error {
  constructor(readonly code: AuthErrorCode) {
    super(code);
    this.name = 'AuthError';
  }

  static fromHttp(response: HttpErrorResponse): AuthError {
    if (response.status === 0) {
      return new AuthError('network');
    }
    const body: unknown = response.error;
    const code =
      typeof body === 'object' && body !== null && 'error' in body ? (body as { error: unknown }).error : null;
    return new AuthError(API_CODES.find((known) => known === code) ?? 'invalid_google_token');
  }
}
