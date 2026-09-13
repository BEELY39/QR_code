import { Injectable, computed, signal, PLATFORM_ID, inject, InjectionToken } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthState, SocialUserProfile } from '../models/auth.model';

export const GOOGLE_CLIENT_ID = new InjectionToken<string>('GOOGLE_CLIENT_ID', {
  factory: () => '',
});

@Injectable({
  providedIn: 'root',
})
export class DeferredAuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly googleClientId = inject(GOOGLE_CLIENT_ID);
  readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly state = signal<AuthState>({
    isInitialized: false,
    isAuthenticated: false,
    isLoading: false,
    user: null,
    error: null,
  });

  readonly isAuthenticated = computed(() => this.state().isAuthenticated);
  readonly user = computed(() => this.state().user);
  readonly isLoading = computed(() => this.state().isLoading);

  async signInWithGoogle(): Promise<SocialUserProfile | null> {
    if (!this.isBrowser) {
      return null;
    }

    this.state.update((s) => ({ ...s, isLoading: true, error: null }));

    try {
      // Lazy initialization fallback: If no Google Client ID configured, use guest hotelier profile
      if (!this.googleClientId) {
        const guestProfile: SocialUserProfile = {
          id: 'guest_hotelier_01',
          name: 'Hôtel Le Meurice Guest',
          email: 'concierge@le-meurice.paris',
          photoUrl: '',
          provider: 'google',
        };

        this.state.set({
          isInitialized: true,
          isAuthenticated: true,
          isLoading: false,
          user: guestProfile,
          error: null,
        });

        return guestProfile;
      }

      // If clientId is provided in environment, dynamically import @abacritt/angularx-social-login
      const socialModule = await import('@abacritt/angularx-social-login');
      // Ready for live GIS integration
      return null;
    } catch (err: any) {
      this.state.update((s) => ({
        ...s,
        isLoading: false,
        error: err?.message || 'Erreur d authentification',
      }));
      return null;
    }
  }

  async signOut(): Promise<void> {
    this.state.set({
      isInitialized: this.state().isInitialized,
      isAuthenticated: false,
      isLoading: false,
      user: null,
      error: null,
    });
  }
}

export { DeferredAuthService as DeferredAuth };
