import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';

import { SiteHeaderComponent } from './site-header.component';
import { AuthService } from '../../../core/auth/auth.service';
import { AppUser } from '../../../core/auth/auth.model';

const USER: AppUser = { id: 'u1', email: 'a@example.com', displayName: 'Alice', pictureUrl: null };

describe('SiteHeaderComponent', () => {
  let fixture: ComponentFixture<SiteHeaderComponent>;
  let user: ReturnType<typeof signal<AppUser | null>>;
  let logout: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    user = signal<AppUser | null>(null);
    logout = vi.fn().mockResolvedValue(undefined);
    await TestBed.configureTestingModule({
      imports: [SiteHeaderComponent],
      providers: [provideRouter([]), { provide: AuthService, useValue: { user, logout } }],
    }).compileComponents();
    fixture = TestBed.createComponent(SiteHeaderComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('affiche la barre de navigation en état anonyme', () => {
    expect(fixture.nativeElement.querySelector('app-navbar #nav-auth-link')).toBeTruthy();
  });

  it('transmet l’utilisateur connecté à la barre de navigation', () => {
    user.set(USER);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-navbar #nav-account-link')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Alice');
  });

  it('déconnecte l’utilisateur quand la barre émet logout', () => {
    user.set(USER);
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('#nav-logout-button') as HTMLButtonElement).click();

    expect(logout).toHaveBeenCalled();
  });
});
