import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AuthService, HAS_SESSION_KEY } from './auth.service';
import { API_BASE_URL } from './api-base-url.token';
import { AppUser } from './auth.model';
import { AuthError } from './auth-error';

const API = 'http://api.test';
const USER: AppUser = {
  id: '6f1c2c1e-3b0e-4c0a-9d8e-2b7f5a1c9e40',
  email: 'a@example.com',
  displayName: 'Alice',
  pictureUrl: null,
};

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: API_BASE_URL, useValue: API }],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('démarre dans un état inconnu', () => {
    expect(service.status()).toBe('unknown');
    expect(service.user()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  describe('loginWithGoogle', () => {
    it('envoie la preuve Google à l’API et passe à l’état connecté', async () => {
      const pending = service.loginWithGoogle('google-id-token');

      const req = http.expectOne(`${API}/api/auth/google`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ credential: 'google-id-token' });
      expect(req.request.withCredentials).toBe(true);
      req.flush({ user: USER, newAccount: true });

      await expect(pending).resolves.toEqual({ user: USER, newAccount: true });
      expect(service.status()).toBe('authenticated');
      expect(service.user()).toEqual(USER);
      expect(localStorage.getItem(HAS_SESSION_KEY)).toBe('true');
    });

    it('reste anonyme et relaie le code d’erreur de l’API', async () => {
      const pending = service.loginWithGoogle('mauvais-jeton');

      http
        .expectOne(`${API}/api/auth/google`)
        .flush({ error: 'invalid_google_token' }, { status: 401, statusText: 'Unauthorized' });

      const error = await pending.catch((e: unknown) => e);
      expect(error).toBeInstanceOf(AuthError);
      expect((error as AuthError).code).toBe('invalid_google_token');
      expect(service.isAuthenticated()).toBe(false);
      expect(localStorage.getItem(HAS_SESSION_KEY)).toBeNull();
    });
  });
});
