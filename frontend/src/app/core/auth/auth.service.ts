import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AppUser, AuthStatus, LoginResponse } from './auth.model';
import { API_BASE_URL } from './api-base-url.token';
import { AuthError } from './auth-error';

/** Indicateur « une session a été ouverte dans ce navigateur » — jamais le jeton lui-même. */
export const HAS_SESSION_KEY = 'qrcraft.hasSession';

/**
 * État d'authentification du site (contracts/frontend-auth.md).
 * Le jeton QRCraft vit dans un cookie HttpOnly posé par l'API : ce service ne le voit jamais.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  private readonly statusSignal = signal<AuthStatus>('unknown');
  private readonly userSignal = signal<AppUser | null>(null);

  readonly status = this.statusSignal.asReadonly();
  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.statusSignal() === 'authenticated');

  /**
   * Remet la preuve d'identité Google à l'API, qui pose le cookie de session.
   * @throws AuthError avec le code renvoyé par l'API
   */
  async loginWithGoogle(idToken: string): Promise<LoginResponse> {
    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(
          `${this.apiBaseUrl}/api/auth/google`,
          { credential: idToken },
          { withCredentials: true }
        )
      );
      this.setAuthenticated(response.user);
      return response;
    } catch (error) {
      this.setAnonymous();
      throw error instanceof HttpErrorResponse ? AuthError.fromHttp(error) : new AuthError('network');
    }
  }

  /**
   * Vérifie la session auprès de l'API (`GET /api/me`).
   * @returns l'utilisateur, ou `null` si aucune session valide
   */
  async refresh(): Promise<AppUser | null> {
    try {
      const user = await firstValueFrom(
        this.http.get<AppUser>(`${this.apiBaseUrl}/api/me`, { withCredentials: true })
      );
      this.setAuthenticated(user);
      return user;
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        this.setAnonymous();
      } else {
        // API injoignable : on ne sait pas, on garde l'indicateur pour réessayer au prochain chargement.
        this.userSignal.set(null);
        this.statusSignal.set('anonymous');
      }
      return null;
    }
  }

  /**
   * Appelé une fois au démarrage, dans le navigateur uniquement. Sans indicateur de session,
   * aucun appel réseau : l'accueil d'un visiteur anonyme ne contacte pas l'API.
   */
  initFromBrowser(): void {
    if (!this.isBrowser) {
      return;
    }
    if (this.hasSessionHint()) {
      void this.refresh();
    } else {
      this.setAnonymous();
    }
  }

  /** Session refusée par l'API (401 sur un appel protégé). */
  markSessionExpired(): void {
    this.setAnonymous();
  }

  protected setAuthenticated(user: AppUser): void {
    this.userSignal.set(user);
    this.statusSignal.set('authenticated');
    this.writeHasSession(true);
  }

  protected setAnonymous(): void {
    this.userSignal.set(null);
    this.statusSignal.set('anonymous');
    this.writeHasSession(false);
  }

  protected hasSessionHint(): boolean {
    if (!this.isBrowser) {
      return false;
    }
    try {
      return localStorage.getItem(HAS_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  }

  private writeHasSession(value: boolean): void {
    if (!this.isBrowser) {
      return;
    }
    try {
      if (value) {
        localStorage.setItem(HAS_SESSION_KEY, 'true');
      } else {
        localStorage.removeItem(HAS_SESSION_KEY);
      }
    } catch {
      // Stockage indisponible (navigation privée stricte) : l'état en mémoire suffit.
    }
  }
}
