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

  describe('refresh', () => {
    it('lit l’utilisateur de la session et passe à l’état connecté', async () => {
      const pending = service.refresh();

      const req = http.expectOne(`${API}/api/me`);
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBe(true);
      req.flush(USER);

      await expect(pending).resolves.toEqual(USER);
      expect(service.status()).toBe('authenticated');
      expect(localStorage.getItem(HAS_SESSION_KEY)).toBe('true');
    });

    it('passe à l’état anonyme et oublie l’indicateur sur un 401', async () => {
      localStorage.setItem(HAS_SESSION_KEY, 'true');
      const pending = service.refresh();

      http.expectOne(`${API}/api/me`).flush(null, { status: 401, statusText: 'Unauthorized' });

      await expect(pending).resolves.toBeNull();
      expect(service.status()).toBe('anonymous');
      expect(localStorage.getItem(HAS_SESSION_KEY)).toBeNull();
    });
  });

  describe('initFromBrowser', () => {
    it('ne fait aucun appel réseau pour un visiteur qui ne s’est jamais connecté', () => {
      service.initFromBrowser();

      http.expectNone(`${API}/api/me`);
      expect(service.status()).toBe('anonymous');
    });

    it('vérifie la session quand une connexion a déjà eu lieu dans ce navigateur', () => {
      localStorage.setItem(HAS_SESSION_KEY, 'true');
      service.initFromBrowser();

      http.expectOne(`${API}/api/me`).flush(USER);
    });
  });

  describe('markSessionExpired', () => {
    it('repasse à l’état anonyme et retire l’indicateur', () => {
      localStorage.setItem(HAS_SESSION_KEY, 'true');
      service.markSessionExpired();

      expect(service.status()).toBe('anonymous');
      expect(localStorage.getItem(HAS_SESSION_KEY)).toBeNull();
    });
  });
});
