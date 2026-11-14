import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';

import { AppHomeComponent } from './app-home.component';
import { AuthService } from '../../core/auth/auth.service';
import { AppUser } from '../../core/auth/auth.model';

const USER: AppUser = { id: 'u1', email: 'a@example.com', displayName: 'Alice', pictureUrl: null };

describe('AppHomeComponent', () => {
  let fixture: ComponentFixture<AppHomeComponent>;

  async function setup(user: AppUser | null) {
    await TestBed.configureTestingModule({
      imports: [AppHomeComponent],
      providers: [provideRouter([]), { provide: AuthService, useValue: { user: signal(user) } }],
    }).compileComponents();
    fixture = TestBed.createComponent(AppHomeComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('salue l’utilisateur connecté et affiche son initiale sans photo', async () => {
    await setup(USER);
    const host: HTMLElement = fixture.nativeElement;
    expect(host.querySelector('h1')?.textContent).toContain('Bonjour, Alice');
    expect(host.textContent).toContain('A');
  });

  it('n’affiche le message de bienvenue qu’après une création de compte', async () => {
    await setup(USER);
    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();

    fixture.componentInstance.newAccount.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain('Bienvenue');
  });

  it('indique le chargement tant que l’utilisateur n’est pas connu', async () => {
    await setup(null);
    expect(fixture.nativeElement.textContent).toContain('Chargement de votre espace');
  });
});
