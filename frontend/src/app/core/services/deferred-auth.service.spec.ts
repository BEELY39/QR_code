import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { DeferredAuthService, GOOGLE_CLIENT_ID } from './deferred-auth.service';

describe('DeferredAuthService (Catégorie 2 - Test Unitaire)', () => {
  let service: DeferredAuthService;

  describe('Environnement Navigateur (Client)', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          DeferredAuthService,
          { provide: PLATFORM_ID, useValue: 'browser' },
          { provide: GOOGLE_CLIENT_ID, useValue: '' },
        ],
      });
      service = TestBed.inject(DeferredAuthService);
    });

    it('devrait être initialisé avec un état différé et non authentifié (Principe V)', () => {
      expect(service).toBeTruthy();
      expect(service.isBrowser).toBe(true);
      expect(service.state().isInitialized).toBe(false);
      expect(service.isAuthenticated()).toBe(false);
      expect(service.user()).toBeNull();
    });

    it('devrait fournir un profil invité sécurisé en mode fallback sans crasher', async () => {
      const profile = await service.signInWithGoogle();
      expect(profile).toBeTruthy();
      expect(profile?.email).toBe('concierge@le-meurice.paris');
      expect(service.isAuthenticated()).toBe(true);
      expect(service.user()?.id).toBe('guest_hotelier_01');
    });

    it('devrait réinitialiser l état lors de la déconnexion', async () => {
      await service.signInWithGoogle();
      expect(service.isAuthenticated()).toBe(true);

      await service.signOut();
      expect(service.isAuthenticated()).toBe(false);
      expect(service.user()).toBeNull();
    });
  });

  describe('Environnement Serveur (SSR)', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          DeferredAuthService,
          { provide: PLATFORM_ID, useValue: 'server' },
        ],
      });
      service = TestBed.inject(DeferredAuthService);
    });

    it('devrait détecter le mode serveur et no-op sans tenter d authentification', async () => {
      expect(service.isBrowser).toBe(false);
      const res = await service.signInWithGoogle();
      expect(res).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
    });
  });
});
