import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { AppUser } from '../../../../core/auth/auth.model';

const USER: AppUser = { id: 'u1', email: 'a@example.com', displayName: 'Alice Martin', pictureUrl: null };

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should include link to /articles in desktop navigation', () => {
    const articlesLink: HTMLAnchorElement = fixture.nativeElement.querySelector('#nav-articles-link');
    expect(articlesLink).toBeTruthy();
    expect(articlesLink.getAttribute('href')).toBe('/articles');
  });

  it('should toggle mobile menu and include link to /articles', () => {
    expect(component.menuOpen()).toBe(false);

    component.toggleMenu();
    expect(component.menuOpen()).toBe(true);

    fixture.detectChanges();
    const mobileLink: HTMLAnchorElement = fixture.nativeElement.querySelector('#mobile-nav-articles-link');
    expect(mobileLink).toBeTruthy();
    expect(mobileLink.getAttribute('href')).toBe('/articles');

    component.closeMenu();
    expect(component.menuOpen()).toBe(false);
  });

  it('should not contain dead #tarifs link', () => {
    const tarifsLink = fixture.nativeElement.querySelector('a[href="#tarifs"]');
    expect(tarifsLink).toBeNull();
  });

  describe('état de connexion', () => {
    const host = (): HTMLElement => fixture.nativeElement;

    it('propose la connexion et l’inscription à un visiteur anonyme', () => {
      expect(host().querySelector('#nav-auth-link')?.getAttribute('href')).toBe('/connexion');
      expect(host().querySelector('a[href="/inscription"]')).toBeTruthy();
      expect(host().querySelector('#nav-account-link')).toBeNull();
    });

    it('affiche l’utilisateur connecté et l’accès à son espace', () => {
      fixture.componentRef.setInput('user', USER);
      fixture.detectChanges();

      expect(host().querySelector('#nav-auth-link')).toBeNull();
      expect(host().querySelector('#nav-account-link')?.getAttribute('href')).toBe('/app');
      expect(host().textContent).toContain('Alice Martin');
      expect(host().querySelector('#nav-user-avatar')?.textContent?.trim()).toBe('A');
    });

    it('propose « Mon espace » dans le menu mobile une fois connecté', () => {
      fixture.componentRef.setInput('user', USER);
      component.toggleMenu();
      fixture.detectChanges();

      expect(host().querySelector('#mobile-nav-account-link')?.getAttribute('href')).toBe('/app');
      expect(host().querySelector('#mobile-menu a[href="/inscription"]')).toBeNull();
    });
  });
});
