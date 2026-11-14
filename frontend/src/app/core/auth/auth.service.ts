import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AppUser, AuthStatus } from './auth.model';

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

  private readonly statusSignal = signal<AuthStatus>('unknown');
  private readonly userSignal = signal<AppUser | null>(null);

  readonly status = this.statusSignal.asReadonly();
  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.statusSignal() === 'authenticated');

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
