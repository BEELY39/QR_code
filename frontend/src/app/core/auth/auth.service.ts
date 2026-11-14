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
