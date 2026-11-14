/** Utilisateur connecté, tel que renvoyé par `GET /api/me` (contracts/auth-api.md). */
export interface AppUser {
  id: string;
  email: string;
  displayName: string;
  pictureUrl: string | null;
}

/** Réponse de `POST /api/auth/google`. */
export interface LoginResponse {
  user: AppUser;
  newAccount: boolean;
}

/** `unknown` tant que la session n'a pas été vérifiée dans le navigateur. */
export type AuthStatus = 'unknown' | 'anonymous' | 'authenticated';

/** Codes d'erreur de l'API, plus `network` quand l'API ne répond pas. */
export type AuthErrorCode =
  | 'invalid_request'
  | 'invalid_google_token'
  | 'email_not_verified'
  | 'google_unavailable'
  | 'network';
