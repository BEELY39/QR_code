import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { authInterceptor } from './auth.interceptor';
import { API_BASE_URL } from './api-base-url.token';
import { AuthService } from './auth.service';

const API = 'http://api.test';

describe('authInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let markSessionExpired: ReturnType<typeof vi.fn>;
  let navigateByUrl: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    markSessionExpired = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: API },
        { provide: AuthService, useValue: { markSessionExpired } },
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
    navigateByUrl = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
  });

  afterEach(() => controller.verify());

  it('joint le cookie de session aux appels à l’API', () => {
    void firstValueFrom(http.get(`${API}/api/me`));
    expect(controller.expectOne(`${API}/api/me`).request.withCredentials).toBe(true);
  });

  it('laisse les autres hôtes inchangés', () => {
    void firstValueFrom(http.get('https://fonts.example.com/font.css'));
    expect(controller.expectOne('https://fonts.example.com/font.css').request.withCredentials).toBe(false);
  });

  it('renvoie vers la connexion quand un appel protégé répond 401', async () => {
    const pending = firstValueFrom(http.get(`${API}/api/campaigns`)).catch(() => null);
    controller.expectOne(`${API}/api/campaigns`).flush(null, { status: 401, statusText: 'Unauthorized' });
    await pending;

    expect(markSessionExpired).toHaveBeenCalled();
    expect(navigateByUrl).toHaveBeenCalledWith(expect.stringMatching(/^\/connexion\?retour=/));
  });

  it('ne redirige pas sur un 401 de /api/me (vérification silencieuse)', async () => {
    const pending = firstValueFrom(http.get(`${API}/api/me`)).catch(() => null);
    controller.expectOne(`${API}/api/me`).flush(null, { status: 401, statusText: 'Unauthorized' });
    await pending;

    expect(navigateByUrl).not.toHaveBeenCalled();
  });

  it('ne redirige pas sur un 401 de la connexion elle-même', async () => {
    const pending = firstValueFrom(http.post(`${API}/api/auth/google`, {})).catch(() => null);
    controller.expectOne(`${API}/api/auth/google`).flush({ error: 'invalid_google_token' }, { status: 401, statusText: 'Unauthorized' });
    await pending;

    expect(navigateByUrl).not.toHaveBeenCalled();
  });
});
